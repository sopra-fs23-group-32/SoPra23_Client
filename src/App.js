import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import Footer from "components/views/Footer";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
    <div>
      <Header height="120" content="Guess the City!"/>
      <AppRouter/>
      <Footer height="30" content="SoPra HS23 Group32  All rights reserve."/>
    </div>
  );
};

export default App;
