const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

const collections = {
    users: db.collection('users'),
    vocabulary: db.collection('vocabulary'),
    letters: db.collection('letters'),
    sentences: db.collection('sentences'),
    memory_status: db.collection('memory_status'),
    user_progress: db.collection('user_progress'),
    user_vocabulary_progress: db.collection('user_vocabulary_progress')
};

module.exports = {
    db,
    _,
    userCollection: collections.users,
    vocabularyCollection: collections.vocabulary,
    letterCollection: collections.letters,
    sentenceCollection: collections.sentences,
    memoryStatusCollection: collections.memory_status,
    userProgressCollection: collections.user_progress,
    progressCollection: collections.user_vocabulary_progress,
    collections
};
