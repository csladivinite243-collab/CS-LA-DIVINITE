# Site vitrine C.S LA DIVINITÉ — prêt pour GitHub Pages

Site 100 % statique : aucun serveur, aucune base de données. `index.html` est à la racine.

## Publier sur GitHub (GitHub Desktop)
1. Extrayez le ZIP dans un **nouveau dossier** (jamais dans le dossier du site complet).
2. GitHub Desktop > File > Add local repository > choisissez ce dossier (ou créez un nouveau dépôt avec ce dossier).
3. Commit to main, puis Publish repository / Push origin. Le dépôt peut être public (requis pour Pages gratuit).
4. Sur github.com : dépôt > Settings > Pages > Source : *Deploy from a branch* > Branch `main`, dossier `/ (root)` > Save.
5. Attendez 1 à 3 minutes : le site est sur `https://VOTRE-NOM.github.io/NOM-DU-DEPOT/`.
6. Aperçu de partage (WhatsApp, Facebook) : dans PowerShell, dans ce dossier, tapez
   `node outils/configurer-partage.js "https://VOTRE-NOM.github.io/NOM-DU-DEPOT/"` puis faites un nouveau Commit et Push.

## Vérifier avant d'envoyer
`node outils/verifier-avant-github.js` doit afficher « prêt pour GitHub Pages ».
Vous pouvez aussi double-cliquer sur `index.html` pour voir le site chez vous.

## Modifier les contenus
- **Textes** : `data/site.js` (Bloc-notes ou VS Code). Gardez les guillemets, les virgules, la ligne `window.SITE =` et le `;` final. Pour un retour à la ligne, écrivez `\n`. Une virgule oubliée fait disparaître tout le site : relancez la vérification ci-dessus.
- **Remplacer une image** : gardez le même nom de fichier dans `images/` (même extension), puis Commit et Push.
- **Ajouter la photo d'une personne (équipe)** : copiez la photo dans `images/equipe/` (nom sans espace ni accent, minuscules, ex. `directeur-primaire.jpg`), puis dans `data/site.js`, sur le bloc de la personne, remplacez `"image": ""` par `"image": "images/equipe/directeur-primaire.jpg"`.
- **Ajouter une photo à la galerie** : copiez-la dans `images/galerie/` (ex. `photo-02.jpg`) et copiez le bloc `"kind": "photo"` en changeant `id` (nombre jamais utilisé) et `image`.
- **Ajouter une actualité** : copiez un bloc `"kind": "news"` avec un `id` inédit, ou créez-le sur le modèle des autres blocs.
- Sur GitHub, les noms de fichiers distinguent majuscules et minuscules. Gardez des photos de 150 à 500 Ko.

## Limites
Pas d'administration en ligne : le site complet (avec administration) reste sur votre ordinateur pour préparer les contenus. Le formulaire de contact ouvre le courriel du visiteur. Adresses du type `…/#/primaire`.
N'envoyez jamais sur GitHub un fichier `site.db`, un mot de passe, ni des photos d'élèves sans autorisation.
