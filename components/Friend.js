function Friend({ payment, friend }) {
  return (
    <tr>
      <td>{friend.email}</td>
      <td className={`text-${payment.receive > 0 ? "success" : "dark"}`}>
        {payment.receive}
      </td>
      <td className={`text-${payment.pay > 0 ? "danger" : "dark"}`}>
        {payment.pay}
      </td>
      <td
        className={`text-${
          payment.receive - payment.pay > 0 ? "success" : "danger"
        }`}
      >
        {payment.receive - payment.pay > 0
          ? `You are owed ${payment.receive - payment.pay}`
          : `You owe ${payment.pay - payment.receive}`}
      </td>
    </tr>
  );
}

export default Friend;
