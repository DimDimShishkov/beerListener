[database](database.json) - тестовый вариант БД, в которой bars - массив баров, users - массив пользователей, которые предлагают новые места
[script](script.js) - скрипт, который слушает сообщения в чате и в зависимости от тегов в сообщении подтягивает другие скрипты

- список тегов:
  #место - добавляет бар в БД. --Пользователю начисляется +1 карма.--
  #место_dev - добавляет бар напрямую в БД (используется для разработки)
  #место_rm - убирает бар из БД
  #опрос - запускает опрос

Api бота в beerJs

1. Слушает сообщения с тегами #место
   1. Из них парсит ссылку на бар
   2. Добавляет в массив баров
2. Каждую среду или четверг ? запускает опрос, в котором участвуют последние 10 баров
3. По итогам победителя тегает кого-нибудь из оргов и удаляет этот бар из массива баров
4. Если за неделю было добавлено меньше 10 баров, то берет из прошлой недели

———второй релиз————

5. Слушает сообщения, если в нём есть:
   1. Говорят / говорит / говорил / говорила / говор возвращает это слово +", что ты пидор"
   2. По фразе «сидр» возвращает «сидр для пидоров»
   3. Людям, которые предлагают #место добавляет выдуманный рейтинг и выводит в виде сообщения: «Юзернейм, карма повышена. Текущий уровень 3 мисисипи»

———третий релиз————

1. При получении голосового сообщения, пересылает его в парсер и после расшифровки пересылает обратно в чат

ЧТО НУЖНО СДЕЛАТЬ!!!

Метод добавления бара +
Метод удаления бара из сообщения в тг
Метод создания голосования
Метод выбора победителя голосования (учесть равное количество голосов и функцию рандома в этом случае) + удаления бара из массива

