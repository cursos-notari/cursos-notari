export const getDefaultDates = ({ status }: { status: "open" | "planned" }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(tomorrow.getDate() + 1);

  const afterTomorrowPlusOne = new Date(afterTomorrow);
  afterTomorrowPlusOne.setDate(afterTomorrow.getDate() + 1);

  if (status === "open") {
    return {
      openingDate: today,
      closingDate: tomorrow,
      classDays: [{ date: afterTomorrow, time: "15:00" }]
    };
  }

  if (status === "planned") {
    return {
      openingDate: tomorrow,
      closingDate: afterTomorrow,
      classDays: [{ date: afterTomorrowPlusOne, time: "15:00" }]
    }
  }
};