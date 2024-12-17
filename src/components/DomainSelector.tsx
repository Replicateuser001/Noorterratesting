import { useNavigate } from 'react-router-dom'
import DomainCard from './DomainCard'
import { domains } from '../data/domains'

const DomainSelector = () => {
  const navigate = useNavigate()

  const handleDomainClick = (title: string) => {
    navigate(`/domain/${title}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {domains.map((domain) => (
        <DomainCard 
          key={domain.title}
          {...domain} 
          onClick={() => handleDomainClick(domain.title)}
        />
      ))}
    </div>
  )
}

export default DomainSelector