import { ScrollText, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const languages = [
  {
    name: 'English',
    description: 'The Tongue of Whispers - Masters of this ancient language can weave subtle enchantments that influence the minds of others, their words carrying the weight of ancient mist-shrouded isles.',
    paths: [
      { name: 'Grammar', description: 'Master the foundational structures of magical syntax' },
      { name: 'Comprehension', description: 'Unlock the deeper meanings within mystical texts' },
      { name: 'Vocabulary', description: 'Expand your arsenal of power words and phrases' },
      { name: 'Composition', description: 'Craft your own spells and magical writings' },
      { name: 'Omni', description: 'Achieve complete mastery over all aspects of the language' },
    ]
  },
  {
    name: 'German',
    description: 'The Tongue of Thunder - Practitioners channel the primal force of storm and mountain, their incantations echoing with the power of ancient Germanic runes.',
  },
  {
    name: 'Spanish',
    description: 'The Tongue of Flame - These mages command spells of passion and transformation, their words dancing like fire in the hearts of those who hear them.',
  },
  {
    name: 'French',
    description: 'The Tongue of Dreams - Enchantments of illusion and charm flow from these speakers, their magical phrases weaving tapestries of ethereal beauty.',
  },
  {
    name: 'Arabic',
    description: 'The Tongue of Stars - Wielders of this mystical language command cosmic forces, their words carrying the ancient wisdom of desert nights and celestial mathematics.',
  },
]

const LanguageSpecialization = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  const handleLanguageClick = (languageName: string) => {
    if (selectedLanguage === languageName) {
      setSelectedLanguage(null)
      setSelectedPath(null)
    } else {
      setSelectedLanguage(languageName)
      setSelectedPath(null)
    }
  }

  const handlePathClick = (pathName: string) => {
    setSelectedPath(pathName === selectedPath ? null : pathName)
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {languages.map((language) => (
        <div key={language.name}>
          <div 
            onClick={() => handleLanguageClick(language.name)}
            className={`bg-black/20 backdrop-blur-sm border rounded-lg p-4 transition-all duration-200 cursor-pointer
              ${selectedLanguage === language.name 
                ? 'border-purple-400/50 bg-black/30' 
                : 'border-white/10 hover:bg-black/30'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ScrollText className="w-5 h-5 text-purple-300" />
                <h4 className="text-lg font-semibold text-purple-200">{language.name}</h4>
              </div>
              {language.paths && (
                selectedLanguage === language.name ? 
                <ChevronUp className="w-5 h-5 text-purple-300" /> :
                <ChevronDown className="w-5 h-5 text-purple-300" />
              )}
            </div>
            <p className="text-sm text-gray-300 ml-8 mt-2">{language.description}</p>
          </div>

          {selectedLanguage === language.name && language.paths && (
            <div className="ml-8 mt-2 space-y-2 animate-fade-in">
              {language.paths.map((path) => (
                <div
                  key={path.name}
                  onClick={() => handlePathClick(path.name)}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-200
                    ${selectedPath === path.name
                      ? 'bg-purple-500/20 border border-purple-400/30'
                      : 'bg-black/10 border border-white/5 hover:bg-black/20'}`}
                >
                  <h5 className="text-sm font-medium text-purple-200">{path.name}</h5>
                  <p className="text-xs text-gray-400 mt-1">{path.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default LanguageSpecialization