import { CardContent, CardFooter, CardHeader, Card } from '@/components/ui/card'
import { IconCirclePlus } from '@tabler/icons-react'
import { memo } from 'react'

type CreateClassCardProps = {
  onClick: () => void;
}

const CreateClassCard = memo<CreateClassCardProps>(function CreateClassCard({ onClick }) {
  return (
    <Card
      className='hover:cursor-pointer hover:bg-sidebar transition-colors h-full'
      onClick={onClick}
    >
      <CardHeader>&nbsp;</CardHeader>
      <CardContent className="flex flex-grow flex-col items-center justify-center gap-2">
        <span>Criar turma</span>
        <IconCirclePlus />
      </CardContent>
      <CardFooter>&nbsp;</CardFooter>
    </Card>
  )
})

export default CreateClassCard