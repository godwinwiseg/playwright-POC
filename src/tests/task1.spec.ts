import { test, expect } from "../test-fixtures/testFixtures";

test("Task 1 - Survey Questions", async ({ page, surveyPage }) => {
  await surveyPage.gotoSurveyPage();

  // Verify the question is visible
  await surveyPage.verifySingleSelectQuestionVisible();

  // Question: 1 of 6
  await surveyPage.singleRadioSelectOption("Other", "Start Survey");
  await surveyPage.clickStart();

  // Question: 2 of 6
  await surveyPage.fillMultipleAnswers([
    { question: "Mention about your favourite food..", answer: "Burger" },
    { question: "Mention about your favourite beverages", answer: "Hot Chocolate" },
  ]);

  await surveyPage.clickNext();

  // Question: 3 of 6
  await surveyPage.selectUniqueDropdown([2, 1, 3]);

  await surveyPage.clickNext();

  // Question: 4 of 6
  const fruits = ['Apples', 'Oranges', 'Bananas'];
  const vegetables = ['Lettuce', 'Spinach', 'Broccoli'];
  await surveyPage.dragAllItemsToCorrectBoxes(fruits, vegetables);

  await surveyPage.clickNext();

  // Question: 5 of 6
  await surveyPage.matrixRadioSelectOption([
    ["Communication", "Very comfortable"],
    ["Aptitude", "Somewhat comfortable"],
    ["Skillset", "Neutral"],
  ]);

  await surveyPage.clickDone();

  // Question: 6 of 6
  await expect(surveyPage.completionMessage).toHaveText('Thank you for completing this survey.');
});