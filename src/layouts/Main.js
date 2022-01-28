import Header from "../components/Header";
import Footer from "../components/Footer";
import TransactionsBlock from "../components/TransactionsBlock";

function Main() {

  return (
    <div className='wrapper'>
      <Header />
      <div className="content">
        <TransactionsBlock />
      </div>
      <Footer />
    </div>
  );
}

export default Main