// const handlePaletteUpdate = (palette) => {
//   const paletteChange = new CustomEvent("custom:paletteChange")
// }

// class SingletonEventListener {
//   private static instance: SingletonEventListener;
//   private events: Set<string> = new Set();

//   private constructor() {}

//   public static getInstance(): SingletonEventListener {
//     if (!SingletonEventListener.instance) {
//       SingletonEventListener.instance = new SingletonEventListener();
//     }
//     return SingletonEventListener.instance;
//   }

//   public addEventListener(
//     target: EventTarget,
//     event: string,
//     callback: EventListenerOrEventListenerObject
//   ): void {
//     const eventKey = this.getEventKey(target, event, callback);
//     if (!this.events.has(eventKey)) {
//       target.addEventListener(event, callback);
//       this.events.add(eventKey);
//     }
//   }

//   private getEventKey(
//     target: EventTarget,
//     event: string,
//     callback: EventListenerOrEventListenerObject
//   ): string {
//     return `${target.toString()}_${event}_${callback.toString()}`;
//   }
// }

// // Example usage:

// // Create an instance of SingletonEventListener
// const eventListenerInstance = SingletonEventListener.getInstance();

// // Add an event listener (will be added only once)
// const clickHandler = () => {
//   console.log("Button clicked!");
// };

// const button = document.getElementById("myButton");
// if (button) {
//   eventListenerInstance.addEventListener(button, "click", clickHandler);
// }

const num = Math.random();

export const test = () => [
  window.addEventListener("click", () => [console.log(num)]),
];
