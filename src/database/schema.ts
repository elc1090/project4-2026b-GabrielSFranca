import {sql, defineRelations} from "drizzle-orm";
import { usuario } from "./authSchema";
import {
  pgTable, 
  uuid, 
  boolean, 
  text, 
  integer, 
  timestamp, 
  uniqueIndex, 
  pgEnum, 
  check, 
  primaryKey, 
  varchar, 
  smallint, 
  unique, 
  index} 
  from "drizzle-orm/pg-core";

export const mediaTypeEnum=pgEnum('media_type', ['movie', 'tv'])

// export const usuario=pgTable(
//   'usuario', 
//   {
//   id: uuid("id").defaultRandom().primaryKey(),

//   email: text('email').notNull().unique(),
  
//   passwordHash: text('password_hash').notNull(),
  
//   createdAt: timestamp("created_at", {
//       withTimezone: true,
//       mode: "date",
//     })
//       .defaultNow()
//       .notNull(),
// })

export const media = pgTable(
  "media",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    tmdbId: integer("tmdb_id").notNull(),

    mediaType: mediaTypeEnum("media_type").notNull(),

    titulo: varchar("titulo", {
      length: 255,
    }).notNull(),
  },

  (table) => [
    uniqueIndex("media_tmdb_type_idx").on(
      table.tmdbId,
      table.mediaType,
    ),

    check(
      "id_positivo",
      sql`${table.tmdbId} > 0`,
    ),

    check(
      "titulo_nao_nulo",
      sql`length(btrim(${table.titulo})) > 0`,
    ),
  ]
);

export const userReview = pgTable(
  'user_review',
  {
    id: uuid("id").defaultRandom().primaryKey(),

    mediaId: uuid('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
      
    idUsuario: uuid('id_usuario').notNull().references(()=> usuario.id, {onDelete: 'cascade'}),

    fav: boolean('fav').notNull().default(false),
    assistido: boolean('assistido').notNull().default(false),

    nota: smallint('nota'),
    aval_titulo: varchar("aval_titulo", {
      length: 160,
    }),
    aval_texto: text('aval_texto'),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    unique("user_titles_user_title_unique").on(
      table.idUsuario,
      table.mediaId,
    ),

    check(
      "user_titles_review_consistency",
      sql`(
        ${table.aval_titulo} IS NULL
        AND ${table.aval_texto} IS NULL
      ) OR (
        ${table.nota} IS NOT NULL
        AND ${table.aval_titulo} IS NOT NULL
        AND length(btrim(${table.aval_titulo})) > 0
        AND ${table.aval_texto} IS NOT NULL
        AND length(btrim(${table.aval_texto})) > 0
      )`,
    ),

    check(
      "user_titles_rating_range",
      sql`${table.nota} IS NULL OR ${table.nota} BETWEEN 1 AND 10`,
    ),

    check(
      "user_titles_has_interaction",
      sql`${table.assistido} OR ${table.fav} OR ${table.nota} IS NOT NULL`,
    ),
  ],
);

export const playlists = pgTable(
  'playlists', 
  {
    id: uuid("id").defaultRandom().primaryKey(),
    idUsuario: uuid('user_id')
      .notNull()
      .references(() => usuario.id, { onDelete: 'cascade' }),

    nome: varchar("nome", {
      length: 80,
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
},

  (table) => [
    unique("pl_nome_unico").on(
      table.idUsuario,
      table.nome
    ),
    check(
      "pl_nome_nao_vazio",
      sql`length(btrim(${table.nome})) > 0`
    )
  ],
);

export const playlistItems = pgTable(
  'playlist_items',
  {
    playlistId: uuid('playlist_id')
      .notNull()
      .references(() => playlists.id, { onDelete: 'cascade' }),
    mediaItemId: uuid('media_item_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),

    addedAt: timestamp("added_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    primaryKey({
      columns: [table.playlistId, table.mediaItemId],
    }),

    index("playlist_titles_title_id_idx").on(
      table.mediaItemId,
    ),
  ],
);


export const relations = defineRelations(
  {
    usuario,
    media,
    userReview,
    playlists,
    playlistItems,
  },
  (r) => ({
    usuario: {
      reviews: r.many.userReview({
        from: r.usuario.id,
        to: r.userReview.idUsuario,
      }),

      playlists: r.many.playlists({
        from: r.usuario.id,
        to: r.playlists.idUsuario,
      }),
    },

    media: {
      reviews: r.many.userReview({
        from: r.media.id,
        to: r.userReview.mediaId,
      }),

      playlistItems: r.many.playlistItems({
        from: r.media.id,
        to: r.playlistItems.mediaItemId,
      }),
    },

    userReview: {
      user: r.one.usuario({
        from: r.userReview.idUsuario,
        to: r.usuario.id,
      }),

      mediaItem: r.one.media({
        from: r.userReview.mediaId,
        to: r.media.id,
      }),
    },

    playlists: {
      user: r.one.usuario({
        from: r.playlists.idUsuario,
        to: r.usuario.id,
      }),

      items: r.many.playlistItems({
        from: r.playlists.id,
        to: r.playlistItems.playlistId,
      }),
    },

    playlistItems: {
      playlist: r.one.playlists({
        from: r.playlistItems.playlistId,
        to: r.playlists.id,
      }),

      mediaItem: r.one.media({
        from: r.playlistItems.mediaItemId,
        to: r.media.id,
      }),
    },
  }),
);


// relacoes
// export const mediaRel = relations(media, ({ many }) => ({
//   reviews: many(userReview),
// }));

// export const reviewRelation = relations(userReview, ({ one }) => ({
//   media: one(media, {
//     fields: [userReview.mediaId],
//     references: [media.id],
//   }),
// }));
// ////

// export const relUsuario = relations(usuario, ({ many }) => ({
//   mediaItems: many(media),
//   reviews: many(userReview),
//   playlists: many(playlists),
// }));

// export const relMedia = relations(media, ({ one, many }) => ({
//   user: one(usuario, {
//     fields: [media.idUsuario],
//     references: [usuario.id],
//   }),
//   reviews: many(userReview),
//   playlistItems: many(playlistItems),
// }));

// export const userReviewRelations = relations(userReview, ({ one }) => ({
//   user: one(usuario, {
//     fields: [userReview.idUsuario],
//     references: [usuario.id],
//   }),
//   mediaItem: one(media, {
//     fields: [userReview.mediaId],
//     references: [media.id],
//   }),
// }));

// export const playLstRel = relations(playlists, ({ one, many }) => ({
//   user: one(usuario, {
//     fields: [playlists.idUsuario],
//     references: [usuario.id],
//   }),
//   items: many(playlistItems),
// }));

// export const playlistItemsRelations = relations(playlistItems, ({ one }) => ({
//   playlist: one(playlists, {
//     fields: [playlistItems.playlistId],
//     references: [playlists.id],
//   }),
//   mediaItem: one(media, {
//     fields: [playlistItems.mediaItemId],
//     references: [media.id],
//   }),
// }));