import App from "./App";
import { renderToString } from "react-dom/server";

export function renderInNode() {
  return renderToString(<App />);
}
