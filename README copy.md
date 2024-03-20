# Arturik

## Description

Entertainment Telegram bot powered by artificial intelligence GigaChat from Sber.

## Installation

Install Node.js:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm list-remote
nvm install v20.11.0
node -v
```

Install MongoDB:

- [Go](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)

Bot start:

```bash
cp path/russiantrustedca.pem /usr/local/share/ca-certificates/
update-ca-certificates

cd path
npm i
npm -g --ca=null
npm config set strict-ssl false
npm run build

npm install pm2 -g
pm2 start npm --name "GIGACHAT" -- start
```

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```bash
cd existing_repo
git remote add origin https://gitlab.com/evgenyiavra/arturik.git
git branch -M main
git push -uf origin main
```

## Authors

AvraDev
