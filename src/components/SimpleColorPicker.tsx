import React from "react";
import { ChromePicker, ColorResult } from "react-color";
import styled from "@emotion/styled";
import nearestColor from "nearest-color";
import colorNameList from "color-name-list";

export enum ColorType {
  HumanSkin = "HumanSkin",
  // Normal Safe Colors
  Normal = "Normal",
}

type SimpleColorProps = {
  colorType?: ColorType;

  updateColor?: (color: string) => void;
};

function SimpleColorPicker(props: SimpleColorProps) {
  const [color, setColor] = React.useState("rgba(255, 255, 255, 1))");
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const colors = colorNameList.reduce<Record<string, string>>(
    (o, { name, hex }) => Object.assign(o, { [name]: hex }),
    {},
  );
  const nearest = nearestColor.from(colors);
  const handleChange = (color: ColorResult) => {
    let newColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    setColor(newColor);
    if (props.updateColor) {
      let colorName = nearest(color.hex).name;
      // we should add color after the color name, so the StableDiffusion can parse it
      props.updateColor(colorName + " color");
    }
  };

  return (
    <>
      <Swatch onClick={handleClick}>
        <StyleColor color={color} />
      </Swatch>
      {displayColorPicker ? (
        <StylePopover>
          <StyleCover onClick={handleClose} />
          <ChromePicker color={color} onChange={handleChange} />
        </StylePopover>
      ) : null}
    </>
  );
}

const StyleColor = styled.div`
  width: 16px;
  height: 14px;
  border-radius: 2px;
  background: ${(props) => props.color};
`;

const Swatch = styled.div`
  display: inline-block;
  padding: 1px;
  top: 4px;
  left: 4px;
  position: relative;
  background: #fff;
  border-radius: 1px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const StylePopover = styled.div`
  position: absolute;
  z-index: 2;
`;

const StyleCover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export default SimpleColorPicker;