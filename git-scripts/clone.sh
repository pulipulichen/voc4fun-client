if [ -z "$KALS_BRANCH" ]; then KALS_BRANCH=origin/clt; fi
if [ -z "$KALS_PATH" ]; then KALS_PATH=/var/www/html/clt/voc4fun-client; fi
if [ -z "$KALS_DIR" ]; then KALS_DIR=/var/www/html/clt; fi

#echo $KALS_DIR

#cd $KALS_DIR
git clone git://github.com/pulipulichen/voc4fun-client.git "$KALS_PATH"
git reset --hard "$KALS_BRANCH"