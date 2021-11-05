import React from "react";

const Button = ({ characters }) => (
  <ul>
    {characters.map((element) => (
      <li>
        {element.name}
        <img alt={`Photo of ${element.name}`} src={element.img_url} />
      </li>
    ))}
  </ul>
);

export { Button as default };
