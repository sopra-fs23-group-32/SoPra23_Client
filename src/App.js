import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
    <div>
      <Header id="titlea" height="120" content="Guess the City!"/>
      <AppRouter/>
    </div>
  );
};

export default App;
