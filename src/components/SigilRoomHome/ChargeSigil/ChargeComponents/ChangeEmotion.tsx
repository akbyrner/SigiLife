import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {useState} from "react"


export default function changeEmotion() {
  const [emotion, setEmotion] = useState("")


  return (
    <div className="changeemotion">
      <DropdownMenu>
        <DropdownMenuTrigger >
          <Button variant="outline">Select Emotion</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => { setEmotion("Mad") }}>Mad</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setEmotion("Sad") }}>Sad</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setEmotion("Glad") }} >Glad</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="emotion">
        {emotion}
      </div>
    </div>
  )
}
