import { LucideIcon } from 'lucide-react'

interface DomainCardProps {
  title: string
  icon: LucideIcon
  description: string
  color: string
  onClick?: () => void
  isSelected?: boolean
}

const DomainCard = ({ title, icon: Icon, description, color, onClick, isSelected }: DomainCardProps) => {
  return (
    <div 
      className={`group relative overflow-hidden rounded-lg bg-black/30 backdrop-blur-sm border cursor-pointer
        ${isSelected ? 'border-white/30' : 'border-white/10'}
        p-6 transition-all duration-300 hover:scale-105 hover:bg-black/40`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${color} transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className={`w-12 h-12 mb-4 rounded-full bg-gradient-to-br ${color} p-2 flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  )
}

export default DomainCard