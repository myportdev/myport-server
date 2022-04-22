export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ]&& \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd /home/ubuntu/build

npm install 
npm run reload > /home/ubuntu/logs 2>&1 &