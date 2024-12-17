interface EloRange {
  min: number
  optimal: number
  max: number
  forms: {
    easy: string[]    // Grammar forms to test below min ELO
    normal: string[]  // Forms between min and optimal
    hard: string[]    // Forms between optimal and max
    expert: string[]  // Forms above max
  }
}

interface SkillForm {
  name: string
  description: string
  examples: string[]
}

interface LearningPoint {
  name: string
  description: string
  forms: SkillForm[]
}

interface Skill {
  name: string
  eloRange: EloRange
  learningPoints: LearningPoint[]
}

interface SkillPackage {
  name: string
  eloRange: EloRange
  skills: Skill[]
}

interface SkillLevel {
  name: string
  skills: SkillPackage[]
  eloRange?: {
    min: number
    optimal: number
    max: number
  }
}

interface Path {
  name: string
  description: string
  skills: SkillLevel[]
}

interface Language {
  name: string
  description: string
  paths: Path[]
}

export const languages: Language[] = [
  {
    name: 'English',
    description: 'The Tongue of Whispers - Masters of this ancient language can weave subtle enchantments that influence the minds of others, their words carrying the weight of ancient mist-shrouded isles.',
    paths: [
      { 
        name: 'Grammar',
        description: 'Master the foundational structures of magical syntax',
        skills: [
          {
            name: 'Grade 8 Package',
            eloRange: {
              min: 400,
              optimal: 800,
              max: 1200,
              forms: {
                easy: [
                  "Basic application of intermediate grammar concepts. Focus on form recognition and simple usage.",
                  "Common sentence structures and vocabulary.",
                  "Basic time expressions and verb tenses."
                ],
                normal: [
                  "Standard usage patterns with some complexity. Include common exceptions and variations.",
                  "More complex sentence structures and vocabulary.",
                  "Common irregular verbs and verb tenses."
                ],
                hard: [
                  "Complex applications combining multiple rules. Test edge cases and less common forms.",
                  "Sophisticated sentence structures and vocabulary.",
                  "Less common irregular verbs and verb tenses."
                ],
                expert: [
                  "Advanced usage scenarios with subtle distinctions. Combine multiple grammar points.",
                  "Mastery-level sentence structures and vocabulary.",
                  "Rare and complex irregular verbs and verb tenses."
                ]
              }
            },
            skills: [
              { 
                name: 'Basic Tenses',
                eloRange: {
                  min: 200,
                  optimal: 400,
                  max: 600,
                  forms: {
                    easy: [
                      "Focus on simple, everyday usage with clear context. Use basic vocabulary and straightforward situations.",
                      "Present simple affirmative sentences.",
                      "Basic time expressions (now, today, usually)."
                    ],
                    normal: [
                      "Include common time expressions and basic irregular verbs. Mix present and past tenses in simple contexts.",
                      "Present simple questions and negatives.",
                      "Past simple affirmative sentences."
                    ],
                    hard: [
                      "Combine tenses with time clauses. Include less common irregular verbs and more complex time expressions.",
                      "Present perfect simple affirmative sentences.",
                      "Past perfect simple affirmative sentences."
                    ],
                    expert: [
                      "Test edge cases and subtle distinctions between tenses. Include complex time sequences and reported speech.",
                      "Present perfect continuous affirmative sentences.",
                      "Past perfect continuous affirmative sentences."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Present Simple',
                    description: 'Master the present simple tense',
                    forms: [
                      {
                        name: 'Affirmative',
                        description: 'Form affirmative sentences in the present simple',
                        examples: [
                          "I go to school.",
                          "She eats breakfast.",
                          "They play soccer."
                        ]
                      },
                      {
                        name: 'Negative',
                        description: 'Form negative sentences in the present simple',
                        examples: [
                          "I don't go to school.",
                          "She doesn't eat breakfast.",
                          "They don't play soccer."
                        ]
                      },
                      {
                        name: 'Questions',
                        description: 'Form questions in the present simple',
                        examples: [
                          "Do you go to school?",
                          "Does she eat breakfast?",
                          "Do they play soccer?"
                        ]
                      }
                    ]
                  },
                  {
                    name: 'Past Simple',
                    description: 'Master the past simple tense',
                    forms: [
                      {
                        name: 'Affirmative',
                        description: 'Form affirmative sentences in the past simple',
                        examples: [
                          "I went to school.",
                          "She ate breakfast.",
                          "They played soccer."
                        ]
                      },
                      {
                        name: 'Negative',
                        description: 'Form negative sentences in the past simple',
                        examples: [
                          "I didn't go to school.",
                          "She didn't eat breakfast.",
                          "They didn't play soccer."
                        ]
                      },
                      {
                        name: 'Questions',
                        description: 'Form questions in the past simple',
                        examples: [
                          "Did you go to school?",
                          "Did she eat breakfast?",
                          "Did they play soccer?"
                        ]
                      }
                    ]
                  }
                ]
              },
              { 
                name: 'As...as Comparisons',
                eloRange: {
                  min: 400,
                  optimal: 600,
                  max: 800,
                  forms: {
                    easy: [
                      "Basic equality comparisons with common adjectives.",
                      "Simple as...as structures with basic adjectives.",
                      "Common comparison contexts."
                    ],
                    normal: [
                      "Negative comparisons with not as...as.",
                      "Comparisons with adverbs.",
                      "Quantifiers with as...as."
                    ],
                    hard: [
                      "Complex comparisons with multiple elements.",
                      "Double comparatives.",
                      "Idiomatic comparison expressions."
                    ],
                    expert: [
                      "Advanced comparison structures with multiple elements.",
                      "Literary and formal comparison patterns.",
                      "Rare and sophisticated comparison forms."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Equality Comparisons',
                    description: 'Master equality comparisons with as...as',
                    forms: [
                      {
                        name: 'Basic Equality',
                        description: 'Form basic equality comparisons',
                        examples: [
                          "She is as tall as he is.",
                          "He is as smart as she is.",
                          "They are as happy as we are."
                        ]
                      },
                      {
                        name: 'Negative Equality',
                        description: 'Form negative equality comparisons',
                        examples: [
                          "She is not as tall as he is.",
                          "He is not as smart as she is.",
                          "They are not as happy as we are."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Past Perfect',
                eloRange: {
                  min: 500,
                  optimal: 700,
                  max: 900,
                  forms: {
                    easy: [
                      "Basic past perfect for events before a past time.",
                      "Simple had + past participle structures.",
                      "Basic time expressions (before, after, already)."
                    ],
                    normal: [
                      "Past perfect in reported speech.",
                      "Time clauses with after, before, as soon as.",
                      "Mixed past tenses in narratives."
                    ],
                    hard: [
                      "Complex narrative sequences with multiple time layers.",
                      "Past perfect continuous contrast.",
                      "Advanced time references in narratives."
                    ],
                    expert: [
                      "Literary narrative techniques with complex time sequences.",
                      "Subtle distinctions in past references.",
                      "Advanced reported speech patterns."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Past Perfect',
                    description: 'Master the basic past perfect tense',
                    forms: [
                      {
                        name: 'Affirmative',
                        description: 'Form affirmative sentences in the past perfect',
                        examples: [
                          "I had eaten breakfast before I went to school.",
                          "She had studied for the exam before she took it.",
                          "They had traveled to many countries before they moved to the US."
                        ]
                      },
                      {
                        name: 'Negative',
                        description: 'Form negative sentences in the past perfect',
                        examples: [
                          "I hadn't eaten breakfast before I went to school.",
                          "She hadn't studied for the exam before she took it.",
                          "They hadn't traveled to many countries before they moved to the US."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Purpose Clauses',
                eloRange: {
                  min: 500,
                  optimal: 700,
                  max: 900,
                  forms: {
                    easy: [
                      "Basic purpose clauses with to + infinitive.",
                      "Simple in order to structures.",
                      "Common purpose expressions."
                    ],
                    normal: [
                      "So that + can/could/will/would.",
                      "In order that clauses.",
                      "Negative purpose clauses."
                    ],
                    hard: [
                      "Complex purpose expressions with multiple clauses.",
                      "Formal purpose structures.",
                      "Advanced purpose patterns in academic writing."
                    ],
                    expert: [
                      "Sophisticated purpose structures in formal writing.",
                      "Literary purpose patterns.",
                      "Rare and formal purpose expressions."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Purpose Clauses',
                    description: 'Master basic purpose clauses with to + infinitive',
                    forms: [
                      {
                        name: 'Basic Purpose',
                        description: 'Form basic purpose clauses',
                        examples: [
                          "I went to the store to buy milk.",
                          "She studied hard to get good grades.",
                          "They traveled to Europe to visit famous cities."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Reported Speech',
                eloRange: {
                  min: 600,
                  optimal: 800,
                  max: 1000,
                  forms: {
                    easy: [
                      "Basic reported statements with tense changes.",
                      "Simple reporting verbs (say, tell).",
                      "Basic time and place changes."
                    ],
                    normal: [
                      "Reported questions and commands.",
                      "Common reporting verbs with patterns.",
                      "Modal verbs in reported speech."
                    ],
                    hard: [
                      "Complex reporting structures with multiple clauses.",
                      "Advanced reporting verbs and patterns.",
                      "Mixed reported forms in narratives."
                    ],
                    expert: [
                      "Literary reported speech techniques.",
                      "Subtle distinctions in reporting patterns.",
                      "Advanced narrative reporting structures."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Reported Speech',
                    description: 'Master basic reported speech with tense changes',
                    forms: [
                      {
                        name: 'Basic Reported Statement',
                        description: 'Form basic reported statements',
                        examples: [
                          "He said he would go to the store.",
                          "She told me she had eaten breakfast.",
                          "They said they would travel to Europe next year."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Future Perfect',
                eloRange: {
                  min: 600,
                  optimal: 800,
                  max: 1000,
                  forms: {
                    easy: [
                      "Basic future perfect for completed future actions.",
                      "Simple will have + past participle.",
                      "Basic time expressions (by then, by next year)."
                    ],
                    normal: [
                      "Future perfect with time clauses.",
                      "Duration expressions.",
                      "Mixed future forms in complex sentences."
                    ],
                    hard: [
                      "Complex future perfect scenarios.",
                      "Future perfect continuous contrast.",
                      "Advanced time references and sequences."
                    ],
                    expert: [
                      "Sophisticated future perfect structures.",
                      "Literary future perfect patterns.",
                      "Rare and formal future perfect expressions."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Future Perfect',
                    description: 'Master the basic future perfect tense',
                    forms: [
                      {
                        name: 'Affirmative',
                        description: 'Form affirmative sentences in the future perfect',
                        examples: [
                          "I will have eaten breakfast before I go to school.",
                          "She will have studied for the exam before she takes it.",
                          "They will have traveled to many countries before they move to the US."
                        ]
                      },
                      {
                        name: 'Negative',
                        description: 'Form negative sentences in the future perfect',
                        examples: [
                          "I won't have eaten breakfast before I go to school.",
                          "She won't have studied for the exam before she takes it.",
                          "They won't have traveled to many countries before they move to the US."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Conditionals Type 3',
                eloRange: {
                  min: 700,
                  optimal: 900,
                  max: 1100,
                  forms: {
                    easy: [
                      "Basic past unreal conditionals.",
                      "Simple if + past perfect, would have + past participle.",
                      "Common regret expressions."
                    ],
                    normal: [
                      "Mixed time references in type 3.",
                      "Modal verbs in conditionals.",
                      "Unless in type 3 conditionals."
                    ],
                    hard: [
                      "Complex conditional structures.",
                      "Inverted conditionals.",
                      "Mixed conditional types."
                    ],
                    expert: [
                      "Literary conditional techniques.",
                      "Rare conditional combinations.",
                      "Advanced academic conditional usage."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Conditionals Type 3',
                    description: 'Master basic conditionals type 3',
                    forms: [
                      {
                        name: 'Basic Conditional',
                        description: 'Form basic conditionals type 3',
                        examples: [
                          "If I had studied harder, I would have passed the exam.",
                          "If she had eaten breakfast, she wouldn't have been hungry.",
                          "If they had traveled to Europe, they would have visited famous cities."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Passive Voice',
                eloRange: {
                  min: 700,
                  optimal: 900,
                  max: 1100,
                  forms: {
                    easy: [
                      "Basic passive forms in present and past.",
                      "Simple be + past participle structures.",
                      "Common contexts for passive use."
                    ],
                    normal: [
                      "Passive with modal verbs.",
                      "Passive infinitives and -ing forms.",
                      "Get passive structures."
                    ],
                    hard: [
                      "Complex passive constructions.",
                      "Advanced tenses in passive.",
                      "Causative passive forms."
                    ],
                    expert: [
                      "Literary passive techniques.",
                      "Subtle distinctions in passive meanings.",
                      "Advanced academic passive patterns."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Passive Voice',
                    description: 'Master the basic passive voice',
                    forms: [
                      {
                        name: 'Basic Passive',
                        description: 'Form basic passive sentences',
                        examples: [
                          "The ball was thrown by John.",
                          "The play was written by Shakespeare.",
                          "The city was destroyed by the earthquake."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Gerunds & Infinitives',
                eloRange: {
                  min: 800,
                  optimal: 1000,
                  max: 1200,
                  forms: {
                    easy: [
                      "Basic verb patterns with gerunds.",
                      "Simple infinitive structures.",
                      "Common verbs followed by gerund/infinitive."
                    ],
                    normal: [
                      "Verbs followed by both with meaning change.",
                      "Perfect and passive forms.",
                      "Complex verb patterns."
                    ],
                    hard: [
                      "Advanced gerund and infinitive constructions.",
                      "Literary uses of verbal forms.",
                      "Subtle meaning distinctions."
                    ],
                    expert: [
                      "Sophisticated verbal patterns.",
                      "Rare and formal constructions.",
                      "Advanced academic usage."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Gerunds',
                    description: 'Master basic gerunds',
                    forms: [
                      {
                        name: 'Basic Gerund',
                        description: 'Form basic gerunds',
                        examples: [
                          "Eating breakfast is important.",
                          "Studying for the exam is necessary.",
                          "Traveling to Europe is exciting."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Modal Verbs',
                eloRange: {
                  min: 800,
                  optimal: 1000,
                  max: 1200,
                  forms: {
                    easy: [
                      "Basic modals for ability and permission.",
                      "Simple advice and obligation.",
                      "Common modal expressions."
                    ],
                    normal: [
                      "Past modals for speculation.",
                      "Modal perfects.",
                      "Advanced functions of modals."
                    ],
                    hard: [
                      "Complex modal combinations.",
                      "Subtle modal meanings.",
                      "Advanced speculation patterns."
                    ],
                    expert: [
                      "Literary modal techniques.",
                      "Rare modal combinations.",
                      "Advanced academic modal usage."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Modal Verbs',
                    description: 'Master basic modal verbs',
                    forms: [
                      {
                        name: 'Basic Modal',
                        description: 'Form basic modal sentences',
                        examples: [
                          "I can speak English.",
                          "She should study harder.",
                          "They must go to school."
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: 'Grade 9 Package',
            eloRange: {
              min: 800,
              optimal: 1200,
              max: 1500,
              forms: {
                easy: [
                  "Basic application of advanced grammar concepts. Focus on form recognition.",
                  "Common sentence structures and vocabulary.",
                  "Basic time expressions and verb tenses."
                ],
                normal: [
                  "Standard usage of complex structures in varied contexts. Include common variations.",
                  "More complex sentence structures and vocabulary.",
                  "Common irregular verbs and verb tenses."
                ],
                hard: [
                  "Sophisticated applications with multiple interacting rules. Test edge cases.",
                  "Sophisticated sentence structures and vocabulary.",
                  "Less common irregular verbs and verb tenses."
                ],
                expert: [
                  "Mastery-level usage combining multiple advanced concepts. Include rare forms.",
                  "Mastery-level sentence structures and vocabulary.",
                  "Rare and complex irregular verbs and verb tenses."
                ]
              }
            },
            skills: [
              { 
                name: 'Relative Clauses',
                eloRange: {
                  min: 800,
                  optimal: 1000,
                  max: 1200,
                  forms: {
                    easy: [
                      "Basic defining relative clauses with who, which, that.",
                      "Simple subject and object relatives.",
                      "Common contexts for relative clauses."
                    ],
                    normal: [
                      "Non-defining relative clauses.",
                      "Whose and where in relatives.",
                      "Omission of relative pronouns."
                    ],
                    hard: [
                      "Complex relative structures with prepositions.",
                      "Reduced relative clauses.",
                      "Mixed defining and non-defining clauses."
                    ],
                    expert: [
                      "Advanced reduced relatives.",
                      "Literary relative clause patterns.",
                      "Complex noun phrase modifications."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Relative Clauses',
                    description: 'Master basic relative clauses',
                    forms: [
                      {
                        name: 'Basic Relative',
                        description: 'Form basic relative clauses',
                        examples: [
                          "The book, which is on the table, is mine.",
                          "The woman, who is standing over there, is my friend.",
                          "The city, where I was born, is very beautiful."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Past Perfect Continuous',
                eloRange: {
                  min: 900,
                  optimal: 1100,
                  max: 1300,
                  forms: {
                    easy: [
                      "Basic past perfect continuous for duration before past.",
                      "Simple had been + -ing forms.",
                      "Basic time expressions with for/since."
                    ],
                    normal: [
                      "Contrast with past perfect simple.",
                      "Complex time references.",
                      "Mixed narrative tenses."
                    ],
                    hard: [
                      "Multiple time references in narratives.",
                      "Advanced duration expressions.",
                      "Complex cause and effect relationships."
                    ],
                    expert: [
                      "Literary narrative techniques.",
                      "Subtle aspectual distinctions.",
                      "Advanced time layering in narratives."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Past Perfect Continuous',
                    description: 'Master the basic past perfect continuous tense',
                    forms: [
                      {
                        name: 'Basic Past Perfect Continuous',
                        description: 'Form basic past perfect continuous sentences',
                        examples: [
                          "I had been studying English for three years before I moved to the US.",
                          "She had been working at the company for five years before she quit.",
                          "They had been traveling around the world for six months before they returned home."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Future Perfect Continuous',
                eloRange: {
                  min: 900,
                  optimal: 1100,
                  max: 1300,
                  forms: {
                    easy: [
                      "Basic future perfect continuous for duration.",
                      "Simple will have been + -ing forms.",
                      "Basic time expressions with by/for."
                    ],
                    normal: [
                      "Contrast with future perfect simple.",
                      "Complex time references.",
                      "Mixed future forms."
                    ],
                    hard: [
                      "Multiple time references in future contexts.",
                      "Advanced duration expressions.",
                      "Complex predictions and plans."
                    ],
                    expert: [
                      "Sophisticated future narratives.",
                      "Subtle aspectual distinctions.",
                      "Advanced time layering in future contexts."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Future Perfect Continuous',
                    description: 'Master the basic future perfect continuous tense',
                    forms: [
                      {
                        name: 'Basic Future Perfect Continuous',
                        description: 'Form basic future perfect continuous sentences',
                        examples: [
                          "I will have been studying English for three years by the time I graduate.",
                          "She will have been working at the company for five years by the time she retires.",
                          "They will have been traveling around the world for six months by the time they return home."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Mixed Conditionals',
                eloRange: {
                  min: 1000,
                  optimal: 1200,
                  max: 1400,
                  forms: {
                    easy: [
                      "Basic mixed conditional structures.",
                      "Present/past and past/present combinations.",
                      "Common mixed conditional contexts."
                    ],
                    normal: [
                      "Complex time references in mixed conditionals.",
                      "Modal verbs in mixed forms.",
                      "Unless in mixed conditionals."
                    ],
                    hard: [
                      "Multiple time layers in conditionals.",
                      "Advanced modal combinations.",
                      "Complex cause-effect relationships."
                    ],
                    expert: [
                      "Literary conditional techniques.",
                      "Rare conditional combinations.",
                      "Advanced academic conditional usage."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Mixed Conditionals',
                    description: 'Master basic mixed conditionals',
                    forms: [
                      {
                        name: 'Basic Mixed Conditional',
                        description: 'Form basic mixed conditional sentences',
                        examples: [
                          "If I had studied harder, I would be a doctor now.",
                          "If she had eaten breakfast, she wouldn't be hungry now.",
                          "If they had traveled to Europe, they would have visited famous cities by now."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Inversion',
                eloRange: {
                  min: 1000,
                  optimal: 1200,
                  max: 1400,
                  forms: {
                    easy: [
                      "Basic negative adverbial inversion.",
                      "Simple inversions after never/rarely.",
                      "Common inversion contexts."
                    ],
                    normal: [
                      "Inversion in conditional sentences.",
                      "So/such inversion patterns.",
                      "Question word inversion."
                    ],
                    hard: [
                      "Advanced inversion patterns.",
                      "Literary inversion forms.",
                      "Complex adverbial phrases."
                    ],
                    expert: [
                      "Sophisticated literary inversions.",
                      "Rare inversion patterns.",
                      "Advanced stylistic usage."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Inversion',
                    description: 'Master basic inversion',
                    forms: [
                      {
                        name: 'Basic Inversion',
                        description: 'Form basic inverted sentences',
                        examples: [
                          "Never have I seen such a beautiful sunset.",
                          "Rarely do I eat breakfast.",
                          "Only when I am happy do I smile."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Cleft Sentences',
                eloRange: {
                  min: 1100,
                  optimal: 1300,
                  max: 1500,
                  forms: {
                    easy: [
                      "Basic it-cleft sentences.",
                      "Simple what-cleft forms.",
                      "Common cleft contexts."
                    ],
                    normal: [
                      "All-cleft sentences.",
                      "The thing that... structures.",
                      "Mixed cleft patterns."
                    ],
                    hard: [
                      "Complex cleft constructions.",
                      "Negative cleft forms.",
                      "Advanced emphasis patterns."
                    ],
                    expert: [
                      "Literary cleft techniques.",
                      "Rare cleft combinations.",
                      "Advanced academic usage."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Cleft Sentences',
                    description: 'Master basic cleft sentences',
                    forms: [
                      {
                        name: 'Basic Cleft',
                        description: 'Form basic cleft sentences',
                        examples: [
                          "It was John who ate the last cookie.",
                          "What I need is a good night's sleep.",
                          "All I want is to be happy."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Participle Clauses',
                eloRange: {
                  min: 1100,
                  optimal: 1300,
                  max: 1500,
                  forms: {
                    easy: [
                      "Basic present participle clauses.",
                      "Simple past participle forms.",
                      "Common participial contexts."
                    ],
                    normal: [
                      "Perfect participle clauses.",
                      "Having done structures.",
                      "Mixed participial forms."
                    ],
                    hard: [
                      "Complex participial constructions.",
                      "Advanced time relationships.",
                      "Multiple clause combinations."
                    ],
                    expert: [
                      "Literary participial techniques.",
                      "Rare participial patterns.",
                      "Advanced academic usage."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Participle Clauses',
                    description: 'Master basic participle clauses',
                    forms: [
                      {
                        name: 'Basic Participle',
                        description: 'Form basic participle clauses',
                        examples: [
                          "Eating breakfast, I felt more alert.",
                          "Having studied hard, I felt confident.",
                          "Being tired, I went to bed early."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Subjunctive',
                eloRange: {
                  min: 1200,
                  optimal: 1400,
                  max: 1600,
                  forms: {
                    easy: [
                      "Basic subjunctive in formal contexts.",
                      "Simple that-clause patterns.",
                      "Common subjunctive verbs."
                    ],
                    normal: [
                      "Past subjunctive forms.",
                      "Were to/should structures.",
                      "Mixed subjunctive patterns."
                    ],
                    hard: [
                      "Complex subjunctive constructions.",
                      "Advanced formal expressions.",
                      "Multiple clause combinations."
                    ],
                    expert: [
                      "Literary subjunctive techniques.",
                      "Rare subjunctive patterns.",
                      "Advanced academic usage."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Subjunctive',
                    description: 'Master the basic subjunctive mood',
                    forms: [
                      {
                        name: 'Basic Subjunctive',
                        description: 'Form basic subjunctive sentences',
                        examples: [
                          "It is necessary that he be present.",
                          "I suggest that she take a break.",
                          "It is essential that they be on time."
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Advanced Modal Verbs',
                eloRange: {
                  min: 1200,
                  optimal: 1400,
                  max: 1600,
                  forms: {
                    easy: [
                      "Basic modal perfect forms.",
                      "Simple modal combinations.",
                      "Common advanced modal contexts."
                    ],
                    normal: [
                      "Modal perfect continuous.",
                      "Complex modal combinations.",
                      "Advanced modal meanings."
                    ],
                    hard: [
                      "Multiple modal layers.",
                      "Subtle modal distinctions.",
                      "Complex speculation patterns."
                    ],
                    expert: [
                      "Literary modal techniques.",
                      "Rare modal combinations.",
                      "Advanced academic modal usage."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Basic Advanced Modal Verbs',
                    description: 'Master basic advanced modal verbs',
                    forms: [
                      {
                        name: 'Basic Advanced Modal',
                        description: 'Form basic advanced modal sentences',
                        examples: [
                          "I would have gone to the party if I had been invited.",
                          "She should have studied harder if she wanted to pass the exam.",
                          "They might have won the game if they had practiced more."
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: 'Basic Tenses',
            eloRange: { min: 200, optimal: 400, max: 600 },
            skills: [
              { 
                name: 'Basic Tenses',
                eloRange: {
                  min: 200,
                  optimal: 400,
                  max: 600,
                  forms: {
                    easy: [
                      "Focus on simple, everyday usage with clear context. Use basic vocabulary and straightforward situations.",
                      "Present simple affirmative sentences.",
                      "Basic time expressions (now, today, usually)."
                    ],
                    normal: [
                      "Include common time expressions and basic irregular verbs. Mix present and past tenses in simple contexts.",
                      "Present simple questions and negatives.",
                      "Past simple affirmative sentences."
                    ],
                    hard: [
                      "Combine tenses with time clauses. Include less common irregular verbs and more complex time expressions.",
                      "Present perfect simple affirmative sentences.",
                      "Past perfect simple affirmative sentences."
                    ],
                    expert: [
                      "Test edge cases and subtle distinctions between tenses. Include complex time sequences and reported speech.",
                      "Present perfect continuous affirmative sentences.",
                      "Past perfect continuous affirmative sentences."
                    ]
                  }
                },
                learningPoints: [
                  {
                    name: 'Present Simple',
                    description: 'Master the present simple tense',
                    forms: [
                      {
                        name: 'Affirmative',
                        description: 'Form affirmative sentences in the present simple',
                        examples: [
                          "I go to school.",
                          "She eats breakfast.",
                          "They play soccer."
                        ]
                      },
                      {
                        name: 'Negative',
                        description: 'Form negative sentences in the present simple',
                        examples: [
                          "I don't go to school.",
                          "She doesn't eat breakfast.",
                          "They don't play soccer."
                        ]
                      },
                      {
                        name: 'Questions',
                        description: 'Form questions in the present simple',
                        examples: [
                          "Do you go to school?",
                          "Does she eat breakfast?",
                          "Do they play soccer?"
                        ]
                      }
                    ]
                  },
                  {
                    name: 'Past Simple',
                    description: 'Master the past simple tense',
                    forms: [
                      {
                        name: 'Affirmative',
                        description: 'Form affirmative sentences in the past simple',
                        examples: [
                          "I went to school.",
                          "She ate breakfast.",
                          "They played soccer."
                        ]
                      },
                      {
                        name: 'Negative',
                        description: 'Form negative sentences in the past simple',
                        examples: [
                          "I didn't go to school.",
                          "She didn't eat breakfast.",
                          "They didn't play soccer."
                        ]
                      },
                      {
                        name: 'Questions',
                        description: 'Form questions in the past simple',
                        examples: [
                          "Did you go to school?",
                          "Did she eat breakfast?",
                          "Did they play soccer?"
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: 'Advanced Tenses',
            eloRange: { min: 900, optimal: 1200, max: 1500 },
            skills: [
              { name: 'Present Perfect', eloRange: { min: 900, optimal: 1100, max: 1300 } },
              { name: 'Past Continuous', eloRange: { min: 1000, optimal: 1200, max: 1400 } },
              { name: 'Past Perfect', eloRange: { min: 1100, optimal: 1300, max: 1500 } }
            ]
          }
        ]
      },
      { 
        name: 'Comprehension',
        description: 'Unlock the deeper meanings within mystical texts',
        skills: [
          {
            name: 'Reading Skills',
            eloRange: { min: 800, optimal: 1100, max: 1400 },
            skills: [
              { name: 'Main Idea Identification', eloRange: { min: 800, optimal: 1000, max: 1200 } },
              { name: 'Detail Extraction', eloRange: { min: 900, optimal: 1100, max: 1300 } }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'German',
    description: 'The Tongue of Thunder - Practitioners channel the primal force of storm and mountain, their incantations echoing with the power of ancient Germanic runes.',
    paths: [
      { 
        name: 'Grammar',
        description: 'Master the foundational structures of magical syntax',
        skills: [
          {
            name: 'Basic Tenses',
            eloRange: { min: 600, optimal: 900, max: 1200 },
            skills: [
              { name: 'Present Simple', eloRange: { min: 600, optimal: 800, max: 1000 } },
              { name: 'Past Simple', eloRange: { min: 600, optimal: 800, max: 1000 } },
              { name: 'Present Continuous', eloRange: { min: 700, optimal: 900, max: 1100 } },
              { name: 'Future with going to', eloRange: { min: 700, optimal: 900, max: 1100 } },
              { name: 'Future with will', eloRange: { min: 800, optimal: 1000, max: 1200 } }
            ]
          },
          {
            name: 'Advanced Tenses',
            eloRange: { min: 900, optimal: 1200, max: 1500 },
            skills: [
              { name: 'Present Perfect', eloRange: { min: 900, optimal: 1100, max: 1300 } },
              { name: 'Past Continuous', eloRange: { min: 1000, optimal: 1200, max: 1400 } },
              { name: 'Past Perfect', eloRange: { min: 1100, optimal: 1300, max: 1500 } }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Spanish',
    description: 'The Tongue of Flame - These mages command spells of passion and transformation, their words dancing like fire in the hearts of those who hear them.',
    paths: [
      { 
        name: 'Grammar',
        description: 'Master the foundational structures of magical syntax',
        skills: [
          {
            name: 'Basic Tenses',
            eloRange: { min: 600, optimal: 900, max: 1200 },
            skills: [
              { name: 'Present Simple', eloRange: { min: 600, optimal: 800, max: 1000 } },
              { name: 'Past Simple', eloRange: { min: 600, optimal: 800, max: 1000 } },
              { name: 'Present Continuous', eloRange: { min: 700, optimal: 900, max: 1100 } },
              { name: 'Future with going to', eloRange: { min: 700, optimal: 900, max: 1100 } },
              { name: 'Future with will', eloRange: { min: 800, optimal: 1000, max: 1200 } }
            ]
          },
          {
            name: 'Advanced Tenses',
            eloRange: { min: 900, optimal: 1200, max: 1500 },
            skills: [
              { name: 'Present Perfect', eloRange: { min: 900, optimal: 1100, max: 1300 } },
              { name: 'Past Continuous', eloRange: { min: 1000, optimal: 1200, max: 1400 } },
              { name: 'Past Perfect', eloRange: { min: 1100, optimal: 1300, max: 1500 } }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'French',
    description: 'The Tongue of Dreams - Enchantments of illusion and charm flow from these speakers, their magical phrases weaving tapestries of ethereal beauty.',
    paths: [
      { 
        name: 'Grammar',
        description: 'Master the foundational structures of magical syntax',
        skills: [
          {
            name: 'Basic Tenses',
            eloRange: { min: 600, optimal: 900, max: 1200 },
            skills: [
              { name: 'Present Simple', eloRange: { min: 600, optimal: 800, max: 1000 } },
              { name: 'Past Simple', eloRange: { min: 600, optimal: 800, max: 1000 } },
              { name: 'Present Continuous', eloRange: { min: 700, optimal: 900, max: 1100 } },
              { name: 'Future with going to', eloRange: { min: 700, optimal: 900, max: 1100 } },
              { name: 'Future with will', eloRange: { min: 800, optimal: 1000, max: 1200 } }
            ]
          },
          {
            name: 'Advanced Tenses',
            eloRange: { min: 900, optimal: 1200, max: 1500 },
            skills: [
              { name: 'Present Perfect', eloRange: { min: 900, optimal: 1100, max: 1300 } },
              { name: 'Past Continuous', eloRange: { min: 1000, optimal: 1200, max: 1400 } },
              { name: 'Past Perfect', eloRange: { min: 1100, optimal: 1300, max: 1500 } }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Arabic',
    description: 'The Tongue of Stars - Wielders of this mystical language command cosmic forces, their words carrying the ancient wisdom of desert nights and celestial mathematics.',
    paths: [
      { 
        name: 'Grammar',
        description: 'Master the foundational structures of magical syntax',
        skills: [
          {
            name: 'Basic Tenses',
            eloRange: { min: 600, optimal: 900, max: 1200 },
            skills: [
              { name: 'Present Simple', eloRange: { min: 600, optimal: 800, max: 1000 } },
              { name: 'Past Simple', eloRange: { min: 600, optimal: 800, max: 1000 } },
              { name: 'Present Continuous', eloRange: { min: 700, optimal: 900, max: 1100 } },
              { name: 'Future with going to', eloRange: { min: 700, optimal: 900, max: 1100 } },
              { name: 'Future with will', eloRange: { min: 800, optimal: 1000, max: 1200 } }
            ]
          },
          {
            name: 'Advanced Tenses',
            eloRange: { min: 900, optimal: 1200, max: 1500 },
            skills: [
              { name: 'Present Perfect', eloRange: { min: 900, optimal: 1100, max: 1300 } },
              { name: 'Past Continuous', eloRange: { min: 1000, optimal: 1200, max: 1400 } },
              { name: 'Past Perfect', eloRange: { min: 1100, optimal: 1300, max: 1500 } }
            ]
          }
        ]
      }
    ]
  },
]