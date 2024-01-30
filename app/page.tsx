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
  MoonIcon,
  PersonStanding,
  SunIcon,
  Video,
  Volume,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Rings } from "react-loader-spinner";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { beep } from "../utils/audio";

// ML -
import * as cocossd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

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
  const [model, setModel] = useState<cocossd.ObjectDetection>();
  const [loading, setLoading] = useState(false);

  // LOADING THE MODEL -
  useEffect(() => {
    setLoading(true);
    initModel();
  }, []);

  // Loads Model
  // Set it in a state varaible -
  async function initModel() {
    const loadedModel: cocossd.ObjectDetection = await cocossd.load({
      base: "mobilenet_v2",
    });
    setModel(loadedModel);
    // const model = await loaddeModel
  }

  useEffect(() => {
    if (model) {
      setLoading(false);
    }
  }, [model]);

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
        <div className="h-full flex-1 px-2 overflow-y-scroll">
          <RenderFeatureHighlightsSection />
        </div>
      </div>

      {loading && (
        <div className="z-50 absolute w-full h-full flex items-center justify-center bg-black">
          Getting things ready . . . <Rings height={50} color="red" />
        </div>
      )}
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

  // INNER COMPONENTE :
  function RenderFeatureHighlightsSection() {
    return (
      <div className="text-xs text-muted-foreground">
        <ul className="space-y-4">
          <li>
            <strong>Dark Mode/Sys Theme 🌗</strong>
            <p>Toggle between dark mode and system theme.</p>
            <Button className="my-2 h-6 w-6" variant={"outline"} size={"icon"}>
              <SunIcon size={14} />
            </Button>{" "}
            /{" "}
            <Button className="my-2 h-6 w-6" variant={"outline"} size={"icon"}>
              <MoonIcon size={14} />
            </Button>
          </li>
          <li>
            <strong>Horizontal Flip ↔️</strong>
            <p>Adjust horizontal orientation.</p>
            <Button
              className="h-6 w-6 my-2"
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                setMirrored((prev) => !prev);
              }}
            >
              <FlipHorizontal size={14} />
            </Button>
          </li>
          <Separator />
          <li>
            <strong>Take Pictures 📸</strong>
            <p>Capture snapshots at any moment from the video feed.</p>
            <Button
              className="h-6 w-6 my-2"
              variant={"outline"}
              size={"icon"}
              onClick={userPromptSS}
            >
              <Camera size={14} />
            </Button>
          </li>
          <li>
            <strong>Manual Video Recording 📽️</strong>
            <p>Manually record video clips as needed.</p>
            <Button
              className="h-6 w-6 my-2"
              variant={isRecording ? "destructive" : "outline"}
              size={"icon"}
              onClick={userPromptRecord}
            >
              <Video size={14} />
            </Button>
          </li>
          <Separator />
          <li>
            <strong>Enable/Disable Auto Record 🚫</strong>
            <p>
              Option to enable/disable automatic video recording whenever
              required.
            </p>
            <Button
              className="h-6 w-6 my-2"
              variant={autoRecordEnabled ? "destructive" : "outline"}
              size={"icon"}
              onClick={toggleAutoRecord}
            >
              {autoRecordEnabled ? (
                <Rings color="white" height={30} />
              ) : (
                <PersonStanding size={14} />
              )}
            </Button>
          </li>

          <li>
            <strong>Volume Slider 🔊</strong>
            <p>Adjust the volume level of the notifications.</p>
          </li>
          <li>
            <strong>Camera Feed Highlighting 🎨</strong>
            <p>
              Highlights persons in{" "}
              <span style={{ color: "#FF0F0F" }}>red</span> and other objects in{" "}
              <span style={{ color: "#00B612" }}>green</span>.
            </p>
          </li>
          <Separator />
          <li className="space-y-4">
            <strong>Share your thoughts 💬 </strong>
            {/* <SocialMediaLinks/> */}
            <br />
            <br />
            <br />
          </li>
        </ul>
      </div>
    );
  }
};

export default HomePage;
