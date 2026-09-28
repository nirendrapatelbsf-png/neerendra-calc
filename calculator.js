(() => {
  const result = document.querySelector('#result');
  const expression = document.querySelector('#expression');
  const keypad = document.querySelector('#keypad');
  const overlay = document.querySelector('#offline-overlay');
  const connection = document.querySelector('#connection');
  const connectionLabel = document.querySelector('#connection-label');
  let current = '0';
  let stored = null;
  let operator = null;
  let waitingForOperand = false;
  let finished = false;

  const display = () => { result.textContent = current; };
  const format = (number) => {
    if (!Number.isFinite(number)) return 'Error';
    const rounded = Number.parseFloat(number.toPrecision(11));
    return String(rounded);
  };
  const clear = () => { current = '0'; stored = null; operator = null; waitingForOperand = false; finished = false; expression.innerHTML = '&nbsp;'; display(); };
  const digit = (value) => {
    if (current === 'Error' || waitingForOperand || finished) { current = value; waitingForOperand = false; finished = false; }
    else if (current === '0') current = value;
    else if (current.replace('-', '').replace('.', '').length < 12) current += value;
    display();
  };
  const decimal = () => {
    if (current === 'Error' || waitingForOperand || finished) { current = '0.'; waitingForOperand = false; finished = false; }
    else if (!current.includes('.')) current += '.';
    display();
  };
  const calculate = (left, right, op) => {
    if (op === '+') return left + right;
    if (op === '−') return left - right;
    if (op === '×') return left * right;
    if (op === '÷') return right === 0 ? NaN : left / right;
    return right;
  };
  const chooseOperator = (nextOperator) => {
    const input = Number(current);
    if (operator && !waitingForOperand) {
      const answer = calculate(stored, input, operator);
      current = format(answer);
      display();
      stored = current === 'Error' ? null : Number(current);
    } else stored = input;
    operator = current === 'Error' ? null : nextOperator;
    if (operator) expression.textContent = `${format(stored)} ${operator}`;
    waitingForOperand = true;
    finished = false;
  };
  const equals = () => {
    if (!operator || stored === null || waitingForOperand) return;
    const left = stored;
    const right = Number(current);
    const answer = format(calculate(left, right, operator));
    expression.textContent = `${format(left)} ${operator} ${format(right)} =`;
    current = answer;
    stored = null;
    operator = null;
    waitingForOperand = true;
    finished = true;
    display();
  };
  const act = (action) => {
    if (action === 'clear') clear();
    if (action === 'decimal') decimal();
    if (action === 'equals') equals();
    if (action === 'sign' && current !== '0' && current !== 'Error') { current = current.startsWith('-') ? current.slice(1) : `-${current}`; display(); }
    if (action === 'percent' && current !== 'Error') { current = format(Number(current) / 100); display(); }
  };
  keypad.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || !navigator.onLine) return;
    if (button.dataset.digit !== undefined) digit(button.dataset.digit);
    if (button.dataset.operator) chooseOperator(button.dataset.operator);
    if (button.dataset.action) act(button.dataset.action);
  });
  document.addEventListener('keydown', (event) => {
    if (!navigator.onLine) return;
    if (/^[0-9]$/.test(event.key)) digit(event.key);
    else if (event.key === '.') decimal();
    else if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); equals(); }
    else if (event.key === 'Escape' || event.key === 'Delete') clear();
    else if (event.key === 'Backspace') { current = current.length > 1 ? current.slice(0, -1) : '0'; display(); }
    else if (event.key === '+') chooseOperator('+');
    else if (event.key === '-') chooseOperator('−');
    else if (event.key === '*') chooseOperator('×');
    else if (event.key === '/') { event.preventDefault(); chooseOperator('÷'); }
    else if (event.key === '%') act('percent');
  });
  const setOnlineState = () => {
    const online = navigator.onLine;
    overlay.hidden = online;
    connection.classList.toggle('is-offline', !online);
    connectionLabel.textContent = online ? 'ONLINE' : 'OFFLINE';
    keypad.setAttribute('aria-disabled', String(!online));
  };
  window.addEventListener('online', setOnlineState);
  window.addEventListener('offline', setOnlineState);
  document.querySelector('#retry-button').addEventListener('click', setOnlineState);
  setOnlineState();
})();
