require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const questions = [
  { category: 'F1', text: 'Qui détient le record de victoires en F1 ?', options: ['Lewis Hamilton', 'Michael Schumacher', 'Max Verstappen', 'Ayrton Senna'], correctAnswer: 'Lewis Hamilton' },
  { category: 'F1', text: 'Quelle écurie domine la F1 depuis 2021 ?', options: ['Ferrari', 'McLaren', 'Red Bull', 'Mercedes'], correctAnswer: 'Red Bull' },
  { category: 'F1', text: 'Combien de titres possède Max Verstappen en 2024 ?', options: ['1', '2', '3', '4'], correctAnswer: '4' },
  { category: 'MotoGP', text: 'Qui a remporté le championnat MotoGP 2023 ?', options: ['Marc Marquez', 'Pecco Bagnaia', 'Fabio Quartararo', 'Jorge Martin'], correctAnswer: 'Pecco Bagnaia' },
  { category: 'MotoGP', text: 'Quelle moto pilote Pecco Bagnaia ?', options: ['Honda', 'Yamaha', 'Ducati', 'Suzuki'], correctAnswer: 'Ducati' },
  { category: 'NBA', text: 'Qui a remporté le MVP NBA 2023 ?', options: ['LeBron James', 'Nikola Jokic', 'Giannis Antetokounmpo', 'Stephen Curry'], correctAnswer: 'Nikola Jokic' },
  { category: 'NBA', text: 'Quelle équipe a remporté le titre NBA 2023 ?', options: ['Lakers', 'Warriors', 'Nuggets', 'Celtics'], correctAnswer: 'Nuggets' },
  { category: 'NBA', text: 'Combien de titres NBA possède LeBron James ?', options: ['2', '3', '4', '5'], correctAnswer: '4' },
  { category: 'Manga', text: 'Dans quel manga trouve-t-on le Titan Colossal ?', options: ['One Piece', 'Bleach', 'Attack on Titan', 'Dragon Ball'], correctAnswer: 'Attack on Titan' },
  { category: 'Manga', text: 'Quel est le fruit du démon de Luffy ?', options: ['Mera Mera', 'Gum Gum', 'Hie Hie', 'Pika Pika'], correctAnswer: 'Gum Gum' }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Question.deleteMany();
  await Question.insertMany(questions);
  console.log('10 questions insérées !');
  process.exit(0);
}

seed();