import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { domains } from '../data/domains'

const DomainPage = () => {
  const { domainTitle } = useParams()
  const navigate = useNavigate()
  
  const domain = domains.find(d => d.title === domainTitle)
  
  if (!domain) {
    return <div>Domain not found</div>
  }

  const Icon = domain.icon

  const handleLanguageClick = (language: string) => {
    if (domain.title === 'The Tongue') {
      navigate(`/language/${language}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Domains
      </button>

      <div className="max-w-3xl mx-auto">
        <div className={`w-16 h-16 mb-6 rounded-full bg-gradient-to-br ${domain.color} p-3 flex items-center justify-center`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-4xl font-bold mb-4">{domain.title}</h1>
        <p className="text-xl text-purple-200 mb-8">{domain.description}</p>

        {domain.title === 'The Tongue' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Choose Your Language Path</h2>
            <div className="grid gap-4">
              {['English', 'German', 'Spanish', 'French', 'Arabic'].map((language) => (
                <button
                  key={language}
                  onClick={() => handleLanguageClick(language)}
                  className="p-4 text-left rounded-lg bg-black/30 border border-white/10 hover:bg-black/40 hover:border-purple-400/30 transition-all"
                >
                  <h3 className="text-xl font-semibold text-purple-200">{language}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {domain.title !== 'The Tongue' && (
          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <p className="text-gray-300">
              More details about {domain.title} specialization coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DomainPage