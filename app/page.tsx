"use client";

import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Camera,
  FlipHorizontal,
  PersonStanding,
  Video,
  Volume,
  Volume2,
} from "lucide-react";
import { useRef, useState } from "react";
import { Rings } from "react-loader-spinner";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { beep } from "../utils/audio";

type Props = {};

const HomePage = (props: Props) => {
  // WEBCAM -
  const webCamRef = useRef<Webcam>(null);
  const CanvasRef = useRef<HTMLCanvasElement>(null);

  // STATE VARIABLES -
  const [mirrored, setMirrored] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [autoRecordEnabled, setAutoRecordEnabled] = useState<boolean>(false);
  const [volume, setVolume] = useState(0.8);

  // RETURN FUNCTION -
  return (
    <div className="flex h-screen">
      {/* LEFT DIVISION : WEBCAM and CANVAS */}
      <div className="relative">
        <div className="relative h-screen w-full">
          <Webcam
            className="h-full w-full object-contain p-2"
            ref={webCamRef}
            mirrored={mirrored}
          />

          <canvas
            ref={CanvasRef}
            className="absolute top-0 left-0 h-full w-full object-contain"
          ></canvas>
        </div>
      </div>

      {/* RIGHT DIVISION : WIKI AND BUTTONS */}
      <div className="flex flex-row">

        {/* BUTTON */}
        <div className="border-primary/5 p-2 border-2 max-w-xs flex flex-col gap-2 justify-between rounded-md shadow-md">
          {/* TOP SECTION */}
          <div className="flex flex-col gap-2">
            <ModeToggle />
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                setMirrored((prev) => !prev);
              }}
            >
              {" "}
              <FlipHorizontal />{" "}
            </Button>
            <Separator className="my-2" />
          </div>

          {/* MIDDLE SECTION */}
          <div className="flex flex-col gap-2">
            <Separator />
            <Button variant={"outline"} size={"icon"} onClick={userPromptSS}>
              <Camera />
            </Button>

            <Button
              variant={isRecording ? "destructive" : "outline"}
              size={"icon"}
              onClick={userPromptRecord}
            >
              <Video />
            </Button>

            <Separator className="my-2" />
            <Button
              variant={autoRecordEnabled ? "destructive" : "outline"}
              size={"icon"}
              onClick={toggleAutoRecord}
            >
              {autoRecordEnabled ? (
                <Rings color="white" height={45} />
              ) : (
                <PersonStanding />
              )}
            </Button>
          </div>

          {/* LAST SECTION */}
          <div className="flex flex-col gap-2">
            <Separator className="my-2" />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} size={"icon"}>
                  <Volume2 />
                </Button>
              </PopoverTrigger>

              <PopoverContent>
                <Slider
                  max={1}
                  min={0}
                  step={0.2}
                  defaultValue={[volume]}
                  onValueCommit={(val) => {
                    setVolume(val[0]);
                    beep(val[0]);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* THREE SECTIONS OVER */}
        </div>

        {/* WIKI */}
        <div>
          
        </div>
      </div>
    </div>
  );

  // HANDLER FUNCTION -
  function userPromptSS() {
    // Take picture
    // save it to downloads.
  }

  function userPromptRecord() {}

  function toggleAutoRecord() {
    if (autoRecordEnabled) {
      setAutoRecordEnabled(false);
      // Show toast to user to notify the change -
      toast("AutoRecord disabled");
    } else {
      setAutoRecordEnabled(true);
      toast("AutoRecord enabled");
    }
  }
};

export default HomePage;
