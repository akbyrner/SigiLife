import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



export default function changeEmotion({ emotion, setEmotion }: { emotion: string, setEmotion: (emotion: string) => void }) {


  return (
    <div className="changeemotion">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline"> {emotion || "Choose Emotion"} </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => { setEmotion("Mad") }}>I'm Glad</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setEmotion("Sad") }}>I'm Sad</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setEmotion("Glad") }} >I'm Mad</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="emotion">{emotion}</div>
    </div>
  )
}
