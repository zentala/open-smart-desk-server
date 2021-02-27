# oh-my-zsh
export ZSH="/home/ubuntu/.oh-my-zsh"
ZSH_THEME="robbyrussell"

plugins=(
  git
  yarn
  npm
  node
  nvm
  cp
  history
)

source $ZSH/oh-my-zsh.sh


# NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"
  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")
    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}

add-zsh-hook chpwd load-nvmrc
load-nvmrc


# Unlimited history
export HISTFILESIZE=""
export HISTSIZE="99999999999999"


# User custom configuration
export PATH="$PATH:/home/ubuntu/.local/bin"
export PATH="$PATH:$HOME/.yarn/bin"
export PATH="$PATH:$HOME/.config/yarn/global/node_modules/.bin"

alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias e!='exit'
alias c=clear
