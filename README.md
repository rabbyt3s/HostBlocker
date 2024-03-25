# HostBlocker
HostBlocker is a Python application that allows you to block and unblock hosts by modifying the Windows hosts file.

Voici le README en anglais et en français pour votre code, ainsi qu'une description détaillée :

README (English):

# HostBlocker

HostBlocker is a Python application that allows you to block and unblock hosts by modifying the Windows hosts file. It provides a user-friendly web interface for managing the hosts and supports pagination and search functionality.

## Features

- Block and unblock hosts by adding or removing entries in the Windows hosts file.
- Web-based user interface for easy management of hosts.
- Pagination support to handle large numbers of hosts.
- Search functionality to quickly find specific hosts.

## Prerequisites

- Python 3.x
- Required Python packages: `os`, `shutil`, `tempfile`, `math`, `threading`, `webview`, `http.server`, `json`, `urllib.parse`

## Setup

1. Clone the repository or download the source code.
2. Create a file named `hosts.txt` in the same directory as the script.
3. Add the hosts you want to block, one per line, in the following format:
   ```
   1016557.fls.doubleclick.net
   101.8.194.35.bc.googleusercontent.com
   102.96.202.35.bc.googleusercontent.com
   104.199.64.104
   104.199.65.206
   104.253.200.35.bc.googleusercontent.com
   108.196.222.35.bc.googleusercontent.com
   108.239.185.35.bc.googleusercontent.com
   ```
4. Run the script using the command: `python app.py`

## Usage

1. Launch the application by running the script.
2. A web browser window will open, displaying the HostBlocker interface.
3. Use the interface to view, search, block, and unblock hosts.
4. The changes will be applied to the Windows hosts file in real-time.

## Notes

- The script requires administrative privileges to modify the Windows hosts file.
- The web interface is served locally on port 8000.
- The script uses a separate thread to run the web server, allowing the main thread to handle the web view.

---

Français:

# HostBlocker

HostBlocker est une application Python qui vous permet de bloquer et de débloquer des hôtes en modifiant le fichier hosts de Windows. Elle fournit une interface Web conviviale pour gérer les hôtes et prend en charge la pagination et la recherche.

## Fonctionnalités

- Bloquer et débloquer des hôtes en ajoutant ou en supprimant des entrées dans le fichier hosts de Windows.
- Interface utilisateur basée sur le Web pour une gestion facile des hôtes.
- Prise en charge de la pagination pour gérer un grand nombre d'hôtes.
- Fonctionnalité de recherche pour trouver rapidement des hôtes spécifiques.

## Prérequis

- Python 3.x
- Packages Python requis : `os`, `shutil`, `tempfile`, `math`, `threading`, `webview`, `http.server`, `json`, `urllib.parse`

## Configuration

1. Clonez le dépôt ou téléchargez le code source.
2. Créez un fichier nommé `hosts.txt` dans le même répertoire que le script.
3. Ajoutez les hôtes que vous souhaitez bloquer, un par ligne, au format suivant :
   ```
   1016557.fls.doubleclick.net
   101.8.194.35.bc.googleusercontent.com
   102.96.202.35.bc.googleusercontent.com
   104.199.64.104
   104.199.65.206
   104.253.200.35.bc.googleusercontent.com
   108.196.222.35.bc.googleusercontent.com
   108.239.185.35.bc.googleusercontent.com
   ```
4. Exécutez le script en utilisant la commande : `app.py`

## Utilisation

1. Lancez l'application en exécutant le script.
2. Une fenêtre de navigateur Web s'ouvrira, affichant l'interface de HostBlocker.
3. Utilisez l'interface pour afficher, rechercher, bloquer et débloquer des hôtes.
4. Les modifications seront appliquées au fichier hosts de Windows en temps réel.

## Remarques

- Le script nécessite des privilèges d'administrateur pour modifier le fichier hosts de Windows.
- L'interface Web est servie localement sur le port 8000.
- Le script utilise un thread séparé pour exécuter le serveur Web, permettant au thread principal de gérer la vue Web.
