import { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState(1);
  const [convertFrom, setConvertFrom] = useState("USD");
  const [convertTo, setConvertTo] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setAmount(1);
    setConvertFrom("USD");
    setConvertTo("INR");
    setConvertedAmount(null);
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchConvertedAmount() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${convertFrom}&to=${convertTo}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setConvertedAmount(data.rates[convertTo]);
        } catch (err) {
          if (err.name === "AbortError") {
            // do absolutely nothing
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (amount === 0) return;
      if (convertFrom === convertTo) return;
      fetchConvertedAmount();

      return function () {
        controller.abort();
      };
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
          disabled={isLoading}
        />
        <CurrencyOptions
          className="convert-from"
          value={convertFrom}
          action={updateConvertFrom}
          disabled={isLoading}
        />
        <CurrencyOptions
          className="convert-to"
          value={convertTo}
          action={updateConvertTo}
          disabled={isLoading}
        />
        <p className="output">{convertedAmount}</p>
        <button className="reset" onClick={resetForm}>
          Reset
        </button>
      </form>
    </div>
  );
}

function CurrencyOptions({ className, value, action, disabled }) {
  return (
    <select
      className={className}
      value={value}
      onChange={action}
      disabled={disabled}
    >
      <option value="INR">INR</option>
      <option value="EUR">EUR</option>
      <option value="USD">USD</option>
      <option value="CAD">CAD</option>
    </select>
  );
}

export default App;
