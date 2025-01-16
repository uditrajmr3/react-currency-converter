import { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState(0);
  const [convertFrom, setConvertFrom] = useState("USD");
  const [convertTo, setConvertTo] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);

  function updateAmount(e) {
    setAmount(Number(e.target.value));
  }
  function updateConvertFrom(e) {
    setConvertFrom(e.target.value);
  }
  function updateConvertTo(e) {
    setConvertTo(e.target.value);
  }
  function resetForm() {
    setAmount(0);
    setConvertFrom("USD");
    setConvertTo("INR");
    setConvertedAmount(null);
  }

  useEffect(
    function () {
      async function fetchConvertedAmount() {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${convertFrom}&to=${convertTo}`
        );
        const data = await res.json();
        console.log(data.rates[convertTo]);
        setConvertedAmount(data.rates[convertTo]);
      }
      if (amount === 0) return;
      if (convertFrom === convertTo) return;
      fetchConvertedAmount();
    },
    [amount, convertFrom, convertTo]
  );

  return (
    <div className="App">
      <form className="converter">
        <input
          type="text"
          className="amount"
          value={amount}
          onChange={updateAmount}
        />
        <CurrencyOptions
          className="convert-from"
          value={convertFrom}
          action={updateConvertFrom}
        />
        <CurrencyOptions
          className="convert-to"
          value={convertTo}
          action={updateConvertTo}
        />
        <p className="output">{convertedAmount}</p>
      </form>
    </div>
  );
}

function CurrencyOptions({ className, value, action }) {
  return (
    <select className={className} value={value} onChange={action}>
      <option value="INR">INR</option>
      <option value="EUR">EUR</option>
      <option value="USD">USD</option>
      <option value="CAD">CAD</option>
    </select>
  );
}

export default App;
