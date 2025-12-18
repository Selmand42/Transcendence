# Fastify servisimiz için Node.js tabanlı bir runtime oluşturuyoruz.
FROM node:20-alpine
# Uygulama kodunu saklayacağımız çalışma dizini.
WORKDIR /app
# sqlite3 modülü native derleme gerektirdiğinden temel derleme araçlarını sisteme ekliyoruz.
# Ayrıca sqlite CLI'sını yükleyerek konteyner içinden veritabanını inceleyebilmeyi sağlıyoruz.
RUN apk add --no-cache python3 make g++ sqlite
# Bağımlılık önbelleğini kullanabilmek için paket tanımını önce kopyalıyoruz.
COPY srcs/backend/package*.json ./
# package-lock.json'a göre tam olarak belirtilen bağımlılıkları yüklüyoruz (npm ci production için önerilir).
RUN npm ci
# Geri kalan tüm backend kaynaklarını kopyalayıp derleme dosyalarını oluşturmaya hazır hale getiriyoruz.
COPY srcs/backend/. .
# Tip kontrolü ve build çıktısı oluşturuyoruz; prod ortamında dist klasörü çalışacak.
RUN npm run build
# Servisin dinlediği portu dış dünyaya ilan ediyoruz.
EXPOSE 3000
# Production modunda derlenmiş kodu çalıştırıyoruz.
CMD ["npm","start"]
