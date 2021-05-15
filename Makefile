PATH:=${PATH}:front/node_modules/.bin:back/node_modules/.bin

all: install run

install:
	(cd back && npm install) && (cd front && npm install)

run:
	(cd back && npm run start &) && (cd front && npm run start)

