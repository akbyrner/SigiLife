# SigiLife

An app for creating and sharing magically imbued sigils. 

## 🌟 Features
* **Create Sigils:** Design and generate custom sigils based on your intentions and magical goals.
* **Share & Connect:** Share your magical creations with the SigiLife community.
* **Personal Grimoire:** Save, organize, and track the sigils you've created or collected.

## 🚀 Getting Started

### Prerequisites
* Node.js
* npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sigilife.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server frontend and backend:
   ```bash
   npm start
   ```

## 🛠 Tech Stack
* React / Next.js
* TailwindCSS
* Node + express
* Google oAuth
* **OTHERS**


## 🤝 Contributing

### Naming Conventions

For our components, we use a specific naming convention based on the root word "Sigil":

* **Words starting with 'L':** If a SubComponent would naturally be titled starting with the letter 'L', the 'l' from sigil is dropped to create a PascalCase `SigiLxxx` component.
  * *Example:* `List` -> `SigiList`
  * *Example:* `Layout` -> `SigiLayout`
* **All other letters:** If the Subcomponent would not naturally start with the letter 'L', the component is named PascalCase `SigilXxxx`.
  * *Example:* `Card` -> `SigilCard`
  * *Example:* `Button` -> `SigilButton`
