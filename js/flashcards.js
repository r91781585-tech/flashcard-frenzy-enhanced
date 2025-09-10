// Flashcard Database for Enhanced Flashcard Frenzy

/**
 * Flashcard Database with multiple categories and difficulty levels
 */
const FlashcardDatabase = {
    science: {
        easy: [
            {
                question: "What is the chemical symbol for water?",
                options: ["H2O", "CO2", "NaCl", "O2"],
                correct: 0,
                explanation: "Water is composed of two hydrogen atoms and one oxygen atom."
            },
            {
                question: "How many bones are in an adult human body?",
                options: ["206", "195", "220", "180"],
                correct: 0,
                explanation: "An adult human skeleton has 206 bones."
            },
            {
                question: "What planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1,
                explanation: "Mars appears red due to iron oxide (rust) on its surface."
            },
            {
                question: "What gas do plants absorb from the atmosphere?",
                options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                correct: 2,
                explanation: "Plants absorb CO2 during photosynthesis to make glucose."
            },
            {
                question: "What is the hardest natural substance on Earth?",
                options: ["Gold", "Iron", "Diamond", "Quartz"],
                correct: 2,
                explanation: "Diamond is the hardest natural material, rating 10 on the Mohs scale."
            }
        ],
        medium: [
            {
                question: "What is the powerhouse of the cell?",
                options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
                correct: 1,
                explanation: "Mitochondria produce ATP, the cell's main energy currency."
            },
            {
                question: "What is the speed of light in a vacuum?",
                options: ["300,000 km/s", "150,000 km/s", "299,792,458 m/s", "186,000 mph"],
                correct: 2,
                explanation: "The speed of light in vacuum is exactly 299,792,458 meters per second."
            },
            {
                question: "Which element has the atomic number 6?",
                options: ["Oxygen", "Carbon", "Nitrogen", "Boron"],
                correct: 1,
                explanation: "Carbon has 6 protons, giving it atomic number 6."
            },
            {
                question: "What type of bond holds water molecules together?",
                options: ["Ionic", "Covalent", "Hydrogen", "Metallic"],
                correct: 2,
                explanation: "Hydrogen bonds form between water molecules due to polarity."
            },
            {
                question: "What is the most abundant gas in Earth's atmosphere?",
                options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
                correct: 2,
                explanation: "Nitrogen makes up about 78% of Earth's atmosphere."
            }
        ],
        hard: [
            {
                question: "What is the Heisenberg Uncertainty Principle?",
                options: [
                    "Energy cannot be created or destroyed",
                    "Position and momentum cannot be precisely known simultaneously",
                    "Matter and energy are equivalent",
                    "Entropy always increases"
                ],
                correct: 1,
                explanation: "The uncertainty principle states that the more precisely we know position, the less precisely we can know momentum."
            },
            {
                question: "What is the half-life of Carbon-14?",
                options: ["5,730 years", "1,600 years", "12,000 years", "50,000 years"],
                correct: 0,
                explanation: "Carbon-14 has a half-life of approximately 5,730 years, making it useful for dating organic materials."
            },
            {
                question: "Which enzyme breaks down starch into sugars?",
                options: ["Pepsin", "Lipase", "Amylase", "Trypsin"],
                correct: 2,
                explanation: "Amylase breaks down starch into maltose and other sugars."
            }
        ]
    },
    
    history: {
        easy: [
            {
                question: "In which year did World War II end?",
                options: ["1944", "1945", "1946", "1947"],
                correct: 1,
                explanation: "World War II ended in 1945 with Japan's surrender in September."
            },
            {
                question: "Who was the first President of the United States?",
                options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
                correct: 2,
                explanation: "George Washington served as the first U.S. President from 1789-1797."
            },
            {
                question: "Which ancient wonder of the world was located in Egypt?",
                options: ["Hanging Gardens", "Colossus of Rhodes", "Great Pyramid of Giza", "Lighthouse of Alexandria"],
                correct: 2,
                explanation: "The Great Pyramid of Giza is the only ancient wonder still standing today."
            },
            {
                question: "The Berlin Wall fell in which year?",
                options: ["1987", "1989", "1991", "1993"],
                correct: 1,
                explanation: "The Berlin Wall fell on November 9, 1989, symbolizing the end of the Cold War."
            },
            {
                question: "Which empire was ruled by Julius Caesar?",
                options: ["Greek Empire", "Roman Empire", "Persian Empire", "Byzantine Empire"],
                correct: 1,
                explanation: "Julius Caesar was a Roman general and statesman who became dictator of Rome."
            }
        ],
        medium: [
            {
                question: "The Renaissance began in which country?",
                options: ["France", "Germany", "Italy", "England"],
                correct: 2,
                explanation: "The Renaissance began in Italy in the 14th century, starting in Florence."
            },
            {
                question: "Who wrote the Communist Manifesto?",
                options: ["Vladimir Lenin", "Karl Marx and Friedrich Engels", "Leon Trotsky", "Joseph Stalin"],
                correct: 1,
                explanation: "Karl Marx and Friedrich Engels co-authored the Communist Manifesto in 1848."
            },
            {
                question: "The Hundred Years' War was fought between which two countries?",
                options: ["England and France", "Spain and Portugal", "Germany and Austria", "Italy and Greece"],
                correct: 0,
                explanation: "The Hundred Years' War (1337-1453) was fought between England and France."
            },
            {
                question: "Which civilization built Machu Picchu?",
                options: ["Aztec", "Maya", "Inca", "Olmec"],
                correct: 2,
                explanation: "Machu Picchu was built by the Inca civilization in the 15th century."
            }
        ],
        hard: [
            {
                question: "The Treaty of Westphalia ended which war?",
                options: ["Thirty Years' War", "Seven Years' War", "War of Spanish Succession", "Napoleonic Wars"],
                correct: 0,
                explanation: "The Treaty of Westphalia (1648) ended the Thirty Years' War and established the modern state system."
            },
            {
                question: "Who was the last Byzantine Emperor?",
                options: ["Justinian I", "Constantine XI", "Basil II", "John VIII"],
                correct: 1,
                explanation: "Constantine XI Palaiologos was the last Byzantine Emperor, dying in the fall of Constantinople in 1453."
            }
        ]
    },
    
    geography: {
        easy: [
            {
                question: "What is the capital of Australia?",
                options: ["Sydney", "Melbourne", "Canberra", "Perth"],
                correct: 2,
                explanation: "Canberra is the capital city of Australia, located between Sydney and Melbourne."
            },
            {
                question: "Which is the longest river in the world?",
                options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
                correct: 1,
                explanation: "The Nile River is approximately 6,650 km long, making it the longest river."
            },
            {
                question: "How many continents are there?",
                options: ["5", "6", "7", "8"],
                correct: 2,
                explanation: "There are seven continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia."
            },
            {
                question: "Which country has the most time zones?",
                options: ["Russia", "United States", "China", "Canada"],
                correct: 0,
                explanation: "Russia spans 11 time zones, more than any other country."
            },
            {
                question: "What is the smallest country in the world?",
                options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
                correct: 2,
                explanation: "Vatican City is the smallest country with an area of just 0.17 square miles."
            }
        ],
        medium: [
            {
                question: "Which mountain range contains Mount Everest?",
                options: ["Andes", "Himalayas", "Rocky Mountains", "Alps"],
                correct: 1,
                explanation: "Mount Everest is located in the Himalayas on the border between Nepal and Tibet."
            },
            {
                question: "The Sahara Desert is primarily located in which continent?",
                options: ["Asia", "Australia", "Africa", "South America"],
                correct: 2,
                explanation: "The Sahara Desert covers much of North Africa and is the world's largest hot desert."
            },
            {
                question: "Which strait separates Europe and Asia?",
                options: ["Strait of Gibraltar", "Bosphorus", "Strait of Hormuz", "Bering Strait"],
                correct: 1,
                explanation: "The Bosphorus strait in Turkey separates European and Asian parts of the country."
            }
        ],
        hard: [
            {
                question: "What is the deepest point in Earth's oceans?",
                options: ["Puerto Rico Trench", "Java Trench", "Mariana Trench", "Peru-Chile Trench"],
                correct: 2,
                explanation: "The Challenger Deep in the Mariana Trench is the deepest known point at about 36,200 feet deep."
            }
        ]
    },
    
    literature: {
        easy: [
            {
                question: "Who wrote 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                correct: 1,
                explanation: "William Shakespeare wrote Romeo and Juliet around 1594-1596."
            },
            {
                question: "Which book begins with 'It was the best of times, it was the worst of times'?",
                options: ["Great Expectations", "A Tale of Two Cities", "Oliver Twist", "David Copperfield"],
                correct: 1,
                explanation: "This famous opening line is from Charles Dickens' 'A Tale of Two Cities'."
            },
            {
                question: "Who wrote '1984'?",
                options: ["Aldous Huxley", "Ray Bradbury", "George Orwell", "H.G. Wells"],
                correct: 2,
                explanation: "George Orwell wrote '1984', published in 1949."
            },
            {
                question: "In which city is Shakespeare's 'Romeo and Juliet' set?",
                options: ["Venice", "Florence", "Verona", "Rome"],
                correct: 2,
                explanation: "Romeo and Juliet is set in Verona, Italy."
            }
        ],
        medium: [
            {
                question: "Who wrote 'One Hundred Years of Solitude'?",
                options: ["Gabriel García Márquez", "Mario Vargas Llosa", "Jorge Luis Borges", "Pablo Neruda"],
                correct: 0,
                explanation: "Gabriel García Márquez wrote this masterpiece of magical realism in 1967."
            },
            {
                question: "Which novel features the character Atticus Finch?",
                options: ["The Catcher in the Rye", "To Kill a Mockingbird", "Of Mice and Men", "The Grapes of Wrath"],
                correct: 1,
                explanation: "Atticus Finch is the moral center of Harper Lee's 'To Kill a Mockingbird'."
            }
        ],
        hard: [
            {
                question: "Who wrote 'Ulysses'?",
                options: ["James Joyce", "Virginia Woolf", "T.S. Eliot", "Ezra Pound"],
                correct: 0,
                explanation: "James Joyce wrote 'Ulysses', considered one of the most important modernist novels."
            }
        ]
    },
    
    math: {
        easy: [
            {
                question: "What is 15% of 200?",
                options: ["25", "30", "35", "40"],
                correct: 1,
                explanation: "15% of 200 = 0.15 × 200 = 30"
            },
            {
                question: "What is the square root of 64?",
                options: ["6", "7", "8", "9"],
                correct: 2,
                explanation: "8 × 8 = 64, so √64 = 8"
            },
            {
                question: "What is 7 × 8?",
                options: ["54", "56", "58", "60"],
                correct: 1,
                explanation: "7 × 8 = 56"
            },
            {
                question: "What is the value of π (pi) rounded to two decimal places?",
                options: ["3.14", "3.15", "3.16", "3.17"],
                correct: 0,
                explanation: "π ≈ 3.14159..., which rounds to 3.14"
            }
        ],
        medium: [
            {
                question: "What is the derivative of x²?",
                options: ["x", "2x", "x²", "2x²"],
                correct: 1,
                explanation: "Using the power rule: d/dx(x²) = 2x"
            },
            {
                question: "What is the area of a circle with radius 5?",
                options: ["25π", "10π", "15π", "20π"],
                correct: 0,
                explanation: "Area = πr² = π(5)² = 25π"
            },
            {
                question: "Solve for x: 2x + 5 = 15",
                options: ["3", "4", "5", "6"],
                correct: 2,
                explanation: "2x + 5 = 15 → 2x = 10 → x = 5"
            }
        ],
        hard: [
            {
                question: "What is the integral of sin(x)?",
                options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
                correct: 1,
                explanation: "∫sin(x)dx = -cos(x) + C"
            },
            {
                question: "What is e^(iπ) + 1 equal to? (Euler's identity)",
                options: ["-1", "0", "1", "i"],
                correct: 1,
                explanation: "Euler's identity: e^(iπ) + 1 = 0, one of the most beautiful equations in mathematics."
            }
        ]
    },
    
    sports: {
        easy: [
            {
                question: "How many players are on a basketball team on the court at one time?",
                options: ["4", "5", "6", "7"],
                correct: 1,
                explanation: "Each basketball team has 5 players on the court at any given time."
            },
            {
                question: "In which sport would you perform a slam dunk?",
                options: ["Tennis", "Basketball", "Volleyball", "Baseball"],
                correct: 1,
                explanation: "A slam dunk is a basketball move where a player jumps and scores by putting the ball directly through the hoop."
            },
            {
                question: "How often are the Summer Olympics held?",
                options: ["Every 2 years", "Every 3 years", "Every 4 years", "Every 5 years"],
                correct: 2,
                explanation: "The Summer Olympics are held every 4 years."
            },
            {
                question: "What is the maximum score possible in ten-pin bowling?",
                options: ["200", "250", "300", "350"],
                correct: 2,
                explanation: "A perfect game in bowling consists of 12 strikes for a total score of 300."
            }
        ],
        medium: [
            {
                question: "Which country has won the most FIFA World Cups?",
                options: ["Germany", "Argentina", "Brazil", "Italy"],
                correct: 2,
                explanation: "Brazil has won the FIFA World Cup 5 times (1958, 1962, 1970, 1994, 2002)."
            },
            {
                question: "In tennis, what does 'love' mean?",
                options: ["A perfect shot", "Zero points", "A tie", "Match point"],
                correct: 1,
                explanation: "In tennis scoring, 'love' means zero points."
            },
            {
                question: "How long is a marathon race?",
                options: ["24.2 miles", "25.2 miles", "26.2 miles", "27.2 miles"],
                correct: 2,
                explanation: "A marathon is 26.2 miles or 42.195 kilometers long."
            }
        ],
        hard: [
            {
                question: "Who holds the record for most career home runs in MLB?",
                options: ["Babe Ruth", "Hank Aaron", "Barry Bonds", "Willie Mays"],
                correct: 2,
                explanation: "Barry Bonds holds the record with 762 career home runs."
            }
        ]
    }
};

/**
 * Flashcard Manager Class
 */
class FlashcardManager {
    constructor() {
        this.currentDeck = [];
        this.currentIndex = 0;
        this.usedQuestions = new Set();
        this.categories = Object.keys(FlashcardDatabase);
        this.difficulties = ['easy', 'medium', 'hard'];
    }

    /**
     * Get available categories
     * @returns {Array} Array of category names
     */
    getCategories() {
        return this.categories;
    }

    /**
     * Get available difficulties
     * @returns {Array} Array of difficulty levels
     */
    getDifficulties() {
        return this.difficulties;
    }

    /**
     * Generate a deck of flashcards based on criteria
     * @param {Object} criteria - Selection criteria
     * @param {Array} criteria.categories - Selected categories
     * @param {string} criteria.difficulty - Selected difficulty
     * @param {number} criteria.count - Number of questions
     * @returns {Array} Generated deck
     */
    generateDeck(criteria) {
        const { categories = this.categories, difficulty = 'medium', count = 10 } = criteria;
        let availableQuestions = [];

        // Collect questions from selected categories and difficulty
        categories.forEach(category => {
            if (FlashcardDatabase[category] && FlashcardDatabase[category][difficulty]) {
                const questions = FlashcardDatabase[category][difficulty].map(q => ({
                    ...q,
                    category,
                    difficulty,
                    id: `${category}_${difficulty}_${Math.random().toString(36).substr(2, 9)}`
                }));
                availableQuestions.push(...questions);
            }
        });

        // If not enough questions in selected difficulty, add from other difficulties
        if (availableQuestions.length < count) {
            categories.forEach(category => {
                this.difficulties.forEach(diff => {
                    if (diff !== difficulty && FlashcardDatabase[category] && FlashcardDatabase[category][diff]) {
                        const questions = FlashcardDatabase[category][diff].map(q => ({
                            ...q,
                            category,
                            difficulty: diff,
                            id: `${category}_${diff}_${Math.random().toString(36).substr(2, 9)}`
                        }));
                        availableQuestions.push(...questions);
                    }
                });
            });
        }

        // Shuffle and select required number of questions
        const shuffled = Utils.shuffleArray(availableQuestions);
        this.currentDeck = shuffled.slice(0, Math.min(count, shuffled.length));
        this.currentIndex = 0;
        this.usedQuestions.clear();

        return this.currentDeck;
    }

    /**
     * Get current question
     * @returns {Object|null} Current question or null if deck is empty
     */
    getCurrentQuestion() {
        if (this.currentIndex >= this.currentDeck.length) {
            return null;
        }
        return this.currentDeck[this.currentIndex];
    }

    /**
     * Move to next question
     * @returns {Object|null} Next question or null if no more questions
     */
    nextQuestion() {
        this.currentIndex++;
        return this.getCurrentQuestion();
    }

    /**
     * Check if answer is correct
     * @param {number} answerIndex - Selected answer index
     * @returns {boolean} True if correct
     */
    checkAnswer(answerIndex) {
        const question = this.getCurrentQuestion();
        if (!question) return false;
        
        const isCorrect = answerIndex === question.correct;
        this.usedQuestions.add(question.id);
        
        return isCorrect;
    }

    /**
     * Get question statistics
     * @returns {Object} Statistics object
     */
    getStats() {
        return {
            totalQuestions: this.currentDeck.length,
            currentQuestion: this.currentIndex + 1,
            questionsAnswered: this.usedQuestions.size,
            questionsRemaining: this.currentDeck.length - this.currentIndex - 1
        };
    }

    /**
     * Reset the deck
     */
    reset() {
        this.currentIndex = 0;
        this.usedQuestions.clear();
    }

    /**
     * Get a random question from any category/difficulty
     * @returns {Object} Random question
     */
    getRandomQuestion() {
        const allQuestions = [];
        
        this.categories.forEach(category => {
            this.difficulties.forEach(difficulty => {
                if (FlashcardDatabase[category] && FlashcardDatabase[category][difficulty]) {
                    const questions = FlashcardDatabase[category][difficulty].map(q => ({
                        ...q,
                        category,
                        difficulty,
                        id: `${category}_${difficulty}_${Math.random().toString(36).substr(2, 9)}`
                    }));
                    allQuestions.push(...questions);
                }
            });
        });

        return allQuestions[Math.floor(Math.random() * allQuestions.length)];
    }

    /**
     * Get questions by category
     * @param {string} category - Category name
     * @param {string} difficulty - Difficulty level (optional)
     * @returns {Array} Questions from category
     */
    getQuestionsByCategory(category, difficulty = null) {
        if (!FlashcardDatabase[category]) return [];
        
        if (difficulty && FlashcardDatabase[category][difficulty]) {
            return FlashcardDatabase[category][difficulty].map(q => ({
                ...q,
                category,
                difficulty,
                id: `${category}_${difficulty}_${Math.random().toString(36).substr(2, 9)}`
            }));
        }
        
        // Return all difficulties for the category
        const questions = [];
        this.difficulties.forEach(diff => {
            if (FlashcardDatabase[category][diff]) {
                const qs = FlashcardDatabase[category][diff].map(q => ({
                    ...q,
                    category,
                    difficulty: diff,
                    id: `${category}_${diff}_${Math.random().toString(36).substr(2, 9)}`
                }));
                questions.push(...qs);
            }
        });
        
        return questions;
    }

    /**
     * Search questions by text
     * @param {string} searchTerm - Search term
     * @returns {Array} Matching questions
     */
    searchQuestions(searchTerm) {
        const results = [];
        const term = searchTerm.toLowerCase();
        
        this.categories.forEach(category => {
            this.difficulties.forEach(difficulty => {
                if (FlashcardDatabase[category] && FlashcardDatabase[category][difficulty]) {
                    FlashcardDatabase[category][difficulty].forEach(q => {
                        if (q.question.toLowerCase().includes(term) || 
                            q.options.some(option => option.toLowerCase().includes(term)) ||
                            (q.explanation && q.explanation.toLowerCase().includes(term))) {
                            results.push({
                                ...q,
                                category,
                                difficulty,
                                id: `${category}_${difficulty}_${Math.random().toString(36).substr(2, 9)}`
                            });
                        }
                    });
                }
            });
        });
        
        return results;
    }

    /**
     * Get difficulty distribution for a category
     * @param {string} category - Category name
     * @returns {Object} Difficulty distribution
     */
    getDifficultyDistribution(category) {
        if (!FlashcardDatabase[category]) return {};
        
        const distribution = {};
        this.difficulties.forEach(difficulty => {
            distribution[difficulty] = FlashcardDatabase[category][difficulty] ? 
                FlashcardDatabase[category][difficulty].length : 0;
        });
        
        return distribution;
    }

    /**
     * Get total question count
     * @returns {number} Total number of questions
     */
    getTotalQuestionCount() {
        let total = 0;
        this.categories.forEach(category => {
            this.difficulties.forEach(difficulty => {
                if (FlashcardDatabase[category] && FlashcardDatabase[category][difficulty]) {
                    total += FlashcardDatabase[category][difficulty].length;
                }
            });
        });
        return total;
    }
}

// Export for global use
window.FlashcardManager = FlashcardManager;
window.FlashcardDatabase = FlashcardDatabase;