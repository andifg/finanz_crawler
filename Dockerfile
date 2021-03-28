FROM agners/archlinuxarm

WORKDIR /app

COPY . ./

RUN sed -i 's/SERVER_MODE=false/SERVER_MODE=true/g' .env \
    && mkdir ./logs \
    && pacman -Syu --noconfirm \
    && pacman -S chromium --noconfirm \
    && pacman -S npm --noconfirm \
    && npm i 

CMD [ "node", "app.js" ]
