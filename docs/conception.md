# Analyse du besoin

## Généralités

c'est une nouvelle fonctionnalité sur un site déjà existant

Le site est déjà en production, le serveur déjà adapté à la charge de requêtes
=> éventuellement anticiper une augmentation des requếtes

Idem niveau technique, on restera cohérent avec le site existant
à voir si besoin d'une nouvelle BDD spécifiquement pour la nouvelle fonctionnalité
prévoir PostgreSQL (car entités et relations)

mais côté style d'architecture, même si le site est probablement servi en SSR,
comme la nouvelle fonctionnalité semble autonome on préparera une API pour le back
et une SPA pour le front (interfaces comptes + fiches personnages + interface admin)

évolution de l'interface existante :

- ajout des liens (header, footer) et éventuellement contenu
- nouvelles interfaces SPA (compte, formulaires connexion/création/édition, fiches personnages, ...)
- maquettes et éléments graphiques à fournir

Enfin, il faudra prévoir des ajustements niveau sécurité, RGPD, SEO et tracking (si besoin)
Pas de traduction du site existante, donc pas pour la nouvelle fonctionnalité non-plus

## Fonctionnalités

### Gestion de comptes utilisateurs

- un espace pour administrer les comptes (activer, désactiver, créer, modifier, supprimer)
  - notamment un système de confirmation de l'inscription (car il faut être adhérent à l'association)
  - envoie d'emails (notifications inscriptions et confirmations pour création/activation/suppression)
- un rôle admin
- une page de connexion
- une page d'inscription
- un espace pour modifier/supprimer son compte
- un rôle adhérent

### Gestion de fiches de personnage

- un espace pour afficher toutes les fiches

  - listing (avec filtres)
  - page de résultat de recherche (si besoin)
  - single

- un espace pour gérer des fiches de personnage

  - seules les fiches créées par le compte sont listées (modifiables) (sauf si admin)
  - formulaire de création d'une fiche
  - formulaire de modification/suppression d'une fiche

### une fiche personnage

- email, mot de passe
- statut publié/brouillon
- nom, âge, description physique, bio
- un métier (parmi des métiers génériques)
- un inventaire d'objets (vide initialement)
- la partie de jeu associée (elle-même rattachée à un jeu de rôle)
- des caractéristiques (rattachés à un ou plusieurs jeu de rôle)
- des complétences (génériques)

### Autres entités

- les parties de jeu de rôle déjà existantes ?

  - une partie est toujours rattachée à un jeu de rôle spécifique
  - une partie peut être rattachée à plusieurs personnages

- plusieurs jeux de rôle existants ?
  - aura ses propres champs à définir
  - on prévoit déjà un titre

### Rôles

- **visiteur** peut :
  - déjà voir le site existant
  - voir les fiches de personnage ? Non
  - se connecter/s'inscrire
- **adhérent** peut en plus :
  - modifier/supprimer son compte
  - consulter toutes les fiches publiées
  - créer une fiche
  - associer une fiche à une partie de jeu (à la création, non-modifiable)
  - modifier/supprimer ses fiches créées
- **administrateur** peut en plus :
  - activer/désactiver un compte
  - modifier/supprimer un compte
  - modifier/supprimer une fiche
  - créer/modifier/supprimer un jeu de rôle
  - créer/modifier/supprimer une partie de jeu
  - associer une partie à un jeu de rôle (à la création, non-modifiable)
  - créer/modifier/supprimer une caractéristique
  - associer une caractéristique à un jeu de rôle
  - créer/modifier/supprimer une compétence
  - créer/modifier/supprimer une métier

### fonctionnalités MVP

- gestion des comptes via un espace admin (activer, désactiver, créer, modifier, supprimer)
- création de compte
- modification de compte
- suppression de compte
- création de fiches
- modification de fiches
- suppression de fiches
- consultation de l'ensemble des fiches
- consultation d'une fiche

## User Stories

Hiérarchie des droits :

- `Visiteur <-- Adhérent <-- Admin`

| En tant que    | je souhaite pouvoir                            | afin de                                           |
| -------------- | ---------------------------------------------- | ------------------------------------------------- |
| visiteur       | accéder à la page d'accueil                    | prévisualiser le contenu du site                  |
| visiteur       | accéder au formulaire de connexion             | me connecter                                      |
| visiteur       | accéder au formulaire d'inscription            | m'inscrire                                        |
| visiteur       | réinitialiser mon mot de passe                 | palier à un éventuel oubli                        |
| adhérent       | accéder aux détails de mon compte              | consulter mes informations personnelles           |
| adhérent       |  modifier mes informations personnelles        | les mettre à jour                                 |
|  adhérent      |  supprimer mon compte                          | supprimer mes informations personnelles           |
| adhérent       | accéder à la liste des fiches                  | voir l'ensemble des fiches publiées               |
| adhérent       | filtrer la liste des fiches                    | faciliter la recherche                            |
| adhérent       | ordonner la liste des fiches                   | faciliter la recherche                            |
| adhérent       | rechercher une fiche                           | trouver une fiche spécifique                      |
|  adhérent      |  accéder à une fiche                           | consulter les détails d'un personnage             |
| adhérent       | créer une fiche                                | créer un personnage dans une partie de jeu        |
| adhérent       | enregistrer une fiche en brouillon             | de la finaliser plus tard                         |
| adhérent       | publier une fiche                              | l'afficher publiquement                           |
| adhérent       | modifier une fiche que j'ai créée              |  mettre à jour le personnage                      |
| adhérent       |  associer un métier à une fiche                | indiquer un métier au personnage                  |
| adhérent       |  associer une compétence à une fiche           | indiquer une compétence au personnage             |
| adhérent       |  associer une caractéristique à une fiche      | indiquer une caractéristique au personnage        |
| adhérent       |  associer un objet à une fiche                 | ajouter un objet à l'inventaire du personnage     |
|  adhérent      |  supprimer une fiche que j'ai créée            |  supprimer le personnage d'une partie             |
| administrateur | activer un compte                              | limiter l'inscription aux adhérents               |
| administrateur | désactiver un compte                           | limiter l'inscription aux adhérents               |
| administrateur | supprimer un compte                            | supprimer entièrement un utilisateur              |
| administrateur | modifier un compte                             | corriger une information si nécessaire            |
| administrateur | créer un jeu de rôle                           | élargir le catalogue de jeu                       |
| administrateur | modifier un jeu de rôle                        | mettre à jour ses informations                    |
| administrateur | supprimer un jeu de rôle                       | le supprimer du catalogue                         |
| administrateur | accéder aux détails d'un jeu de rôle           | consulter le nombre de parties associées          |
| administrateur | créer une partie de jeu                        | initier une nouvelle partie dans un jeu de rôle   |
| administrateur | modifier une partie de jeu                     |  corriger une information si nécessaire           |
| administrateur | supprimer une partie de jeu                    | effacer entièrement une partie                    |
| administrateur | accéder aux détails d'une partie de jeu        | consulter le nombre de personnages associés       |
| administrateur | modifier une fiche                             | corriger/compléter un personnage si nécessaire    |
| administrateur | supprimer une fiche                            | supprimer entièrement le personnage d'une partie  |
| administrateur | créer une caractéristique                      | ajouter une caractéristique à un jeu de rôle      |
| administrateur | associer une caractéristique à un jeu de rôle  | ajouter une caractéristique à un jeu de rôle      |
| administrateur | dissocier une caractéristique d'un jeu de rôle | la retirer complètement d'un jeu de rôle          |
| administrateur | modifier une caractéristique                   |  corriger son nom                                 |
| administrateur | supprimer une caractéristique                  | la retirer de tous les jeux de rôle               |
| administrateur | créer une compétence                           | ajouter une nouvelle compétence possible          |
| administrateur | modifier une compétence                        | corriger son nom                                  |
| administrateur | supprimer une compétence                       | la retirer complétement (de tous les personnages) |
| administrateur | créer un métier                                | ajouter un nouveau métier possible                |
| administrateur | modifier un métier                             | corriger son nom                                  |
| administrateur | supprimer un métier                            | le retirer complétement (de tous les personnages) |
| administrateur | modifier un rôle utilisateur                   |                                                   |

## Abuser Stories ?

| En tant que             | je souhaite pouvoir                          | afin de                    |
| ----------------------- | -------------------------------------------- | -------------------------- |
| utilisateur malveillant | exécuter une injection SQL sur un formulaire | de vider la base de donnée |

## Diagrame de cas d'utilisation

Diagramme d'utilisation :

(pour avoir une bonne vision des interraction entre les utilisateurs et le système)

- global : ce que chaque rôle peut faire
- Adhérent - Création d'une fiche personnage
- Inscription (formulaire > activation par admin)

Diagramme de séquence :

(comment les composants d'un système interagissent dans le temps)

- Inscription
- Création fiche

## Wireframes

wireframes à fournir pour avoir une bonne vision des interfaces attendues, ainsi que leurs possibilités d'interaction :

- formulaire inscription (email, pseudo, mot de passe, confirmation mot de passe)
- formulaire connexion (email, mot de passe)
- espace mon compte (incluant formulaire édition (email, pseudo, mot de passe, confirmation mot de passe))
- ✅ liste des fiches personnages
- 🔳 fiche personnage
- 🔳 formulaire création fiche (nom, âge, description, bio, métier, compétences, caractéristiques, objets)
- espace admin (back-office)

## MCD

Entités :

- Fiche de personnage (statut, nom, âge, description, bio, +objets, +métier, +compétence, +caractéristique, +partie)
- Utilisateur (pseudo, email, mot de passe, rôle, actif ?)
- Partie de jeu (+jeu)
- Jeu de rôle (titre)
- Caractéristique (nom, +jeu)
- Objet (nom)
- Compétence (nom)
- métier (nom)

## Dictionnaire de données

Système de Gestion de Base de Donnée Relationnel (SGBDR) : PostgreSQL

Pour toutes les tables :

- `GENERATED` = `INTEGER GENERATED BY DEFAULT AS IDENTITY`
- Ajout des champs :
  - `created_at` : `TYPESTAMPTZ DEFAULT NOW()`
  - `updated_at` : `TYPESTAMPTZ DEFAULT NOW()`

Notes :

- Autre option pour l'`id` : `SERIAL`
- Autre option pour `item.name`, `skill.name`, `job.name`, `characteristic.name` : `VARCHAR(20)`

### Table `user`

| Champ       | Type        | Unique | Not null | Référence | Par défaut | Exemple de valeur | Explication                         |
| ----------- | ----------- | ------ | -------- | --------- | ---------- | ----------------- | ----------------------------------- |
| `id`        | SERIAL      | ✅     | ✅       | -         | -          | 2                 | Identifiant unique de l'utilisateur |
| `email`     | VARCHAR(50) | ✅     | ✅       | -         | -          | "bob@mail.com"    | Adresse email de l'utilisateur      |
| `username`  | VARCHAR(50) | ❌     | ✅       | -         | -          | "Bob"             | Pseudo de l'utilisateur             |
| `password`  | TEXT        | ❌     | ✅       | -         | -          | "$2a$10$..."      | Mot de passe chiffré                |
| `role`      | ENUM        | ❌     | ✅       | -         | 'member'   | "member"          | Rôle ("member" ou "admin")          |
| `is_active` | BOOLEAN     | ❌     | ✅       | -         | false      | true              | Indique si l'utilisateur est actif  |

### Table `character_sheet`

| Champ           | Type         | Unique | Not null | Référence         | Par défaut | Exemple de valeur           | Explication                          |
| --------------- | ------------ | ------ | -------- | ----------------- | ---------- | --------------------------- | ------------------------------------ |
| `id`            | SERIAL       | ✅     | ✅       | -                 | -          | 1                           | Identifiant unique de le personnage  |
| `status`        | ENUM         | ❌     | ✅       | -                 | "draft"    | "published"                 | Statut ("published" ou "draft")      |
| `name`          | VARCHAR(50)  | ❌     | ✅       | -                 | -          | "Elrond"                    | Nom du personnage                    |
| `age`           | NUMERIC(5,0) | ❌     | ✅       | -                 | -          | 6497                        | Âge du personnage                    |
| `physical_desc` | TEXT         | ❌     | ✅       | -                 | -          | "Grand et émiacé ..."       | Description physique du personnage   |
| `bio`           | TEXT         | ❌     | ✅       | -                 | -          | "Seigneur de Rivendell ..." | Présentation du personnage           |
| `campaing_id`   | INT          | ❌     | ✅       | game_campaign(id) | -          | 18                          | Référence vers la partie de jeu liée |
| `user_id`       | INT          | ❌     | ✅       | user(id)          | -          | 2                           | Référence vers l'auteur de la fiche  |
| `job_id`        | INT          | ❌     | ✅       | job(id)           | -          | 5                           | Référence vers le métier rattaché    |

### Table `game_campaign`

| Champ     | Type   | Unique | Not null | Référence | Par défaut | Exemple de valeur | Explication                        |
| --------- | ------ | ------ | -------- | --------- | ---------- | ----------------- | ---------------------------------- |
| `id`      | SERIAL | ✅     | ✅       | -         | -          | 18                | Identifiant unique de la partie    |
| `game_id` | INT    | ❌     | ✅       | game(id)  | -          | 1                 | Référence vers le jeu de la partie |

### Table `game`

| Champ   | Type        | Unique | Not null | Référence | Par défaut | Exemple de valeur         | Explication               |
| ------- | ----------- | ------ | -------- | --------- | ---------- | ------------------------- | ------------------------- |
| `id`    | SERIAL      | ✅     | ✅       | -         | -          | 1                         | Identifiant unique du jeu |
| `title` | VARCHAR(50) | ✅     | ✅       | -         | -          | "Le seigneur des anneaux" | Titre du jeu              |

### Table `game_has_characteristic`

| Champ               | Type | Unique | Not null | Référence          | Par défaut | Exemple de valeur | Explication                        |
| ------------------- | ---- | ------ | -------- | ------------------ | ---------- | ----------------- | ---------------------------------- |
| `game_id`           | INT  | ❌     | ✅       | game(id)           | -          | 1                 | Référence vers le jeu rattaché     |
| `characteristic_id` | INT  | ❌     | ✅       | characteristic(id) | -          | 24                | Référence vers la characteristique |

### Table `character_has_characteristic`

| Champ               | Type | Unique | Not null | Référence           | Par défaut | Exemple de valeur | Explication                           |
| ------------------- | ---- | ------ | -------- | ------------------- | ---------- | ----------------- | ------------------------------------- |
| `character_id`      | INT  | ❌     | ✅       | character_sheet(id) | -          | 1                 | Référence vers le personnage rattaché |
| `characteristic_id` | INT  | ❌     | ✅       | characteristic(id)  | -          | 24                | Référence vers la characteristique    |

### Table `characteristic`

| Champ  | Type        | Unique | Not null | Référence | Par défaut | Exemple de valeur | Explication                              |
| ------ | ----------- | ------ | -------- | --------- | ---------- | ----------------- | ---------------------------------------- |
| `id`   | SERIAL      | ✅     | ✅       | -         | -          | 24                | Identifiant unique de la caractéristique |
| `name` | VARCHAR(50) | ✅     | ✅       | -         | -          | "Sagesse"         | Nom de la characteristique               |

### Table `job`

| Champ  | Type        | Unique | Not null | Référence | Par défaut | Exemple de valeur | Explication                  |
| ------ | ----------- | ------ | -------- | --------- | ---------- | ----------------- | ---------------------------- |
| `id`   | SERIAL      | ✅     | ✅       | -         | -          | 5                 | Identifiant unique du métier |
| `name` | VARCHAR(50) | ✅     | ✅       | -         | -          | "Seigneur elfe"   | Nom du métier                |

### Table `character_has_skill`

| Champ          | Type | Unique | Not null | Référence           | Par défaut | Exemple de valeur | Explication                           |
| -------------- | ---- | ------ | -------- | ------------------- | ---------- | ----------------- | ------------------------------------- |
| `character_id` | INT  | ❌     | ✅       | character_sheet(id) | -          | 1                 | Référence vers le personnage rattaché |
| `skill_id`     | INT  | ❌     | ✅       | skill(id)           | -          | 7                 | Référence vers la compétence          |

### Table `skill`

| Champ  | Type        | Unique | Not null | Référence | Par défaut | Exemple de valeur | Explication                         |
| ------ | ----------- | ------ | -------- | --------- | ---------- | ----------------- | ----------------------------------- |
| `id`   | SERIAL      | ✅     | ✅       | -         | -          | 7                 | Identifiant unique de la compétence |
| `name` | VARCHAR(50) | ✅     | ✅       | -         | -          | "Vue d'aigle"     | Nom de la compétence                |

### Table `inventory`

| Champ          | Type | Unique | Not null | Référence           | Par défaut | Exemple de valeur | Explication                           |
| -------------- | ---- | ------ | -------- | ------------------- | ---------- | ----------------- | ------------------------------------- |
| `character_id` | INT  | ❌     | ✅       | character_sheet(id) | -          | 1                 | Référence vers le personnage rattaché |
| `item_id`      | INT  | ❌     | ✅       | item(id)            | -          | 3                 | Référence vers l'objet                |

### Table `item`

| Champ  | Type        | Unique | Not null | Référence | Par défaut | Exemple de valeur | Explication                   |
| ------ | ----------- | ------ | -------- | --------- | ---------- | ----------------- | ----------------------------- |
| `id`   | SERIAL      | ✅     | ✅       | -         | -          | 7                 | Identifiant unique de l'objet |
| `name` | VARCHAR(50) | ✅     | ✅       | -         | -          | "Arc"             | Nom de l'objet                |

## Suites ?

<!-- ajouter PNJ alliés
  (status "joueur/non-joueur" sur les fiches,
  pouvoir associer plusieurs fiches entres-elles (alliées),
  pouvoir associer fiche "non-joueur" à un jeu de rôle)
-->

<!-- Dev :
  Définir technologies et architecture (serveur Node, React, Prisma, Express, Docker et services, PostgreSQL, ...)
  => CF 01234 oquiz
  création dossier api pour API
  creation dossier client pour SPA

  mise en place environnement : containers docker-compose.yml

  dans api, mis en place NPM et dépendances (prisma, argon2, express, zod, eslint, typescript, ...)
  schéma prisma, routes, controllers, ....

  dans client, mis en place NPM (react, typescript, vite, eslint, tailwind, zustand, axios...)
  structure HTML, composants, style, ...

  définir les tests
  mis en place "husky" pour pre-commits (et scripts de tests automatisées)

-->
