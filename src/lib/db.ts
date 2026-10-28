// IndexedDB helpers (via Dexie) — the web replacement for the mobile app's SQLite.
// Same exported functions + signatures as the mobile lib/db.ts, so stores and libs
// port unchanged. Screens and components never touch Dexie directly.
//
// Uploaded files (PDFs, photos, recordings) are stored as Blobs in the `files`
// table and referenced from notes by an `idb:<id>` uri (see lib/blob-store.ts).

import Dexie, { type Table } from 'dexie';

import type { ChatMessage, ChatSession } from '@/types/chat';
import type { Deadline } from '@/types/deadline';
import type { Note } from '@/types/note';
import type { PodcastEpisode } from '@/types/podcast';
import type { GeneratedQuiz, QuizResult } from '@/types/quiz';
import type { StoredChunk } from '@/types/retrieval';

type ChunkRow = StoredChunk & { id: string };
type SessionRow = { id: string; title: string; createdAt: string; updatedAt: string };
type MessageRow = {
  id: string;
  sessionId: string;
  role: ChatMessage['role'];
  content: string;
  grounded: boolean;
  citations: ChatMessage['citations'];
  error: boolean;
  createdAt: string;
};
type SubjectRow = { name: string; createdAt: string };
export type FileRow = { id: string; blob: Blob; name: string; type: string; createdAt: string };

class ReadIQDatabase extends Dexie {
  notes!: Table<Note, string>;
  subjects!: Table<SubjectRow, string>;
  noteChunks!: Table<ChunkRow, string>;
  chatSessions!: Table<SessionRow, string>;
  chatMessages!: Table<MessageRow, string>;
  podcastEpisodes!: Table<PodcastEpisode, string>;
  quizzes!: Table<GeneratedQuiz, string>;
  quizResults!: Table<QuizResult, string>;
  deadlines!: Table<Deadline, string>;
  files!: Table<FileRow, string>;

  constructor() {
    super('readiq');
    // Only indexed fields are listed; every other field is stored as-is.
    this.version(1).stores({
      notes: 'id, createdAt',
      subjects: 'name, createdAt',
      noteChunks: 'id, noteId',
      chatSessions: 'id, updatedAt',
      chatMessages: 'id, sessionId, createdAt',
      podcastEpisodes: 'noteId',
      quizzes: 'sourceId',
      quizResults: 'id, createdAt',
      deadlines: 'id, dueDate',
      files: 'id',
    });
  }
}

// Opened lazily so importing this module during server rendering never touches IndexedDB.
let instance: ReadIQDatabase | null = null;

export function getDb(): ReadIQDatabase {
  if (typeof indexedDB === 'undefined') throw new Error('IndexedDB is unavailable here.');
  if (!instance) instance = new ReadIQDatabase();
  return instance;
}

// ── Notes ────────────────────────────────────────────────────────────────────

export async function insertNote(note: Note): Promise<void> {
  await getDb().notes.put(note);
}

/** Every saved note, newest first — the Memory Panel's source of truth. */
export async function listNotes(): Promise<Note[]> {
  return getDb().notes.orderBy('createdAt').reverse().toArray();
}

export async function getNoteById(id: string): Promise<Note | null> {
  return (await getDb().notes.get(id)) ?? null;
}

export async function updateNote(
  id: string,
  fields: Pick<
    Note,
    | 'title'
    | 'subject'
    | 'content'
    | 'contentHtml'
    | 'tags'
    | 'attachments'
    | 'readerHtml'
    | 'comments'
    | 'pdfAnnotations'
  > & { aiSummary?: string | null },
): Promise<void> {
  await getDb().notes.update(id, fields);
}

export async function deleteNote(id: string): Promise<void> {
  const db = getDb();
  const note = await db.notes.get(id);
  await db.transaction('rw', [db.notes, db.noteChunks, db.podcastEpisodes, db.files], async () => {
    await db.notes.delete(id);
    // Drop the note's retrieval vectors, cached podcast, and stored attachment files.
    await db.noteChunks.where('noteId').equals(id).delete();
    await db.podcastEpisodes.delete(id);
    const fileIds = (note?.attachments ?? [])
      .map((a) => a.uri)
      .filter((uri) => uri.startsWith('idb:'))
      .map((uri) => uri.slice(4));
    if (fileIds.length) await db.files.bulkDelete(fileIds);
  });
}

// ── Note chunk vectors (semantic retrieval) ──────────────────────────────────

/** Every stored chunk vector across all notes — the corpus retrieval cosine-ranks. */
export async function getAllNoteChunks(): Promise<StoredChunk[]> {
  const rows = await getDb().noteChunks.toArray();
  return rows
    .filter((r) => Array.isArray(r.embedding) && r.embedding.length > 0)
    .map(({ noteId, idx, text, embedding, contentHash }) => ({ noteId, idx, text, embedding, contentHash }));
}

/** noteId → the content_hash its stored chunks were embedded from. */
export async function getNoteChunkHashes(): Promise<Map<string, string>> {
  const rows = await getDb().noteChunks.toArray();
  const map = new Map<string, string>();
  for (const r of rows) if (!map.has(r.noteId)) map.set(r.noteId, r.contentHash);
  return map;
}

/** Replace a note's vectors atomically (delete old, insert fresh) after a save/edit. */
export async function replaceNoteChunks(noteId: string, chunks: StoredChunk[]): Promise<void> {
  const db = getDb();
  await db.transaction('rw', db.noteChunks, async () => {
    await db.noteChunks.where('noteId').equals(noteId).delete();
    await db.noteChunks.bulkPut(chunks.map((c) => ({ ...c, id: `${noteId}:${c.idx}` })));
  });
}

export async function deleteNoteChunks(noteId: string): Promise<void> {
  await getDb().noteChunks.where('noteId').equals(noteId).delete();
}

// ── Subjects ─────────────────────────────────────────────────────────────────

/** Custom subjects/courses the student added, oldest first. */
export async function listSubjects(): Promise<string[]> {
  const rows = await getDb().subjects.orderBy('createdAt').toArray();
  return rows.map((r) => r.name);
}

export async function insertSubject(name: string): Promise<void> {
  const db = getDb();
  if (await db.subjects.get(name)) return;
  await db.subjects.put({ name, createdAt: new Date().toISOString() });
}

// ── Chat history (Ask ★ conversations) ──────────────────────────────────────

export async function insertChatSession(session: SessionRow): Promise<void> {
  await getDb().chatSessions.put(session);
}

export async function touchChatSession(id: string, updatedAt: string): Promise<void> {
  await getDb().chatSessions.update(id, { updatedAt });
}

/** Every saved conversation, most-recently-used first — the history list. */
export async function listChatSessions(): Promise<ChatSession[]> {
  const db = getDb();
  const sessions = await db.chatSessions.orderBy('updatedAt').reverse().toArray();
  return Promise.all(
    sessions.map(async (s) => {
      const messages = await db.chatMessages.where('sessionId').equals(s.id).sortBy('createdAt');
      const firstUser = messages.find((m) => m.role === 'user');
      return {
        id: s.id,
        title: s.title,
        preview: firstUser?.content ?? '',
        messageCount: messages.length,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      };
    }),
  );
}

/** All turns of one conversation, oldest first (chat reading order). */
export async function listChatMessages(sessionId: string): Promise<ChatMessage[]> {
  const rows = await getDb().chatMessages.where('sessionId').equals(sessionId).sortBy('createdAt');
  return rows.map((r) => ({
    id: r.id,
    role: r.role,
    content: r.content,
    grounded: r.grounded,
    citations: r.citations ?? [],
    error: r.error,
    createdAt: r.createdAt,
  }));
}

/** Persist one settled turn (a user question or a finished assistant answer). */
export async function insertChatMessage(sessionId: string, message: ChatMessage): Promise<void> {
  await getDb().chatMessages.put({
    id: message.id,
    sessionId,
    role: message.role,
    content: message.content,
    grounded: message.grounded,
    citations: message.citations,
    error: !!message.error,
    createdAt: message.createdAt,
  });
}

export async function updateChatMessageContent(id: string, content: string): Promise<void> {
  await getDb().chatMessages.update(id, { content });
}

export async function deleteChatSession(id: string): Promise<void> {
  const db = getDb();
  await db.transaction('rw', [db.chatMessages, db.chatSessions], async () => {
    await db.chatMessages.where('sessionId').equals(id).delete();
    await db.chatSessions.delete(id);
  });
}

// ── Podcast episodes ─────────────────────────────────────────────────────────

export async function getPodcastEpisode(noteId: string): Promise<PodcastEpisode | null> {
  return (await getDb().podcastEpisodes.get(noteId)) ?? null;
}

export async function savePodcastEpisode(episode: PodcastEpisode): Promise<void> {
  await getDb().podcastEpisodes.put(episode);
}

// ── Quizzes ──────────────────────────────────────────────────────────────────

export async function getQuiz(sourceId: string): Promise<GeneratedQuiz | null> {
  return (await getDb().quizzes.get(sourceId)) ?? null;
}

export async function saveQuiz(quiz: GeneratedQuiz): Promise<void> {
  // requestedCount is in-memory only (mirrors the mobile schema).
  const { requestedCount: _ignored, ...stored } = quiz;
  void _ignored;
  await getDb().quizzes.put(stored);
}

export async function insertQuizResult(result: QuizResult): Promise<void> {
  await getDb().quizResults.put(result);
}

/** Recent finished attempts, newest first. */
export async function listQuizResults(limit = 20): Promise<QuizResult[]> {
  return getDb().quizResults.orderBy('createdAt').reverse().limit(limit).toArray();
}

// ── Deadlines ────────────────────────────────────────────────────────────────

export async function listDeadlines(): Promise<Deadline[]> {
  return getDb().deadlines.orderBy('dueDate').toArray();
}

export async function insertDeadline(deadline: Deadline): Promise<void> {
  await getDb().deadlines.put(deadline);
}

export async function setDeadlineReminder(id: string, on: boolean): Promise<void> {
  await getDb().deadlines.update(id, { reminderOn: on });
}

export async function deleteDeadline(id: string): Promise<void> {
  await getDb().deadlines.delete(id);
}

// ── Whole-database (Data & Privacy) ─────────────────────────────────────────

/** Everything the student has saved, as plain JSON (files are omitted — they're binary). */
export async function exportAllData(): Promise<Record<string, unknown>> {
  const db = getDb();
  return {
    exportedAt: new Date().toISOString(),
    notes: await db.notes.toArray(),
    subjects: await db.subjects.toArray(),
    chatSessions: await db.chatSessions.toArray(),
    chatMessages: await db.chatMessages.toArray(),
    quizResults: await db.quizResults.toArray(),
    deadlines: await db.deadlines.toArray(),
  };
}

/** Wipe every table (the "Delete all my data" action). */
export async function clearAllData(): Promise<void> {
  const db = getDb();
  await Promise.all(db.tables.map((t) => t.clear()));
}
