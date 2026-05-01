import { expect, Locator, Page } from "@playwright/test";

export class SurveyQuestionsPage {
    readonly page: Page;
    readonly singleSelectQuestion: Locator;
    readonly startButton: Locator;
    readonly nextButton: Locator;
    readonly doneButton: Locator;
    readonly sourceItems: Locator;
    readonly fruitsBox: Locator;
    readonly vegetablesBox: Locator;
    readonly completionMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.singleSelectQuestion = this.page.locator(".question-text-span");
        this.startButton = this.page.getByRole("button", { name: "Start" });
        this.nextButton = this.page.getByRole("button", { name: "Next" });
        this.doneButton = this.page.getByRole("button", { name: "Done" });
        this.sourceItems = page.locator("li[role='listitem'].control-selection");
        this.fruitsBox = page.locator("ul.ui-sortable.second-child2306[role='list']");
        this.vegetablesBox = page.locator("ul.ui-sortable.second-child2307[role='list']");
        this.completionMessage = page.locator("div[style='text-align: center;']");
    }

    async gotoSurveyPage() {
        await this.page.goto(process.env.TASK1_URL!);
    }

    async verifySingleSelectQuestionVisible() {
        await expect(this.singleSelectQuestion).toHaveText(/Single select/);
    }

    async singleRadioSelectOption(option: string, otherText?: string) {
        await this.page.waitForLoadState("networkidle");
        await this.page.getByRole("radio", { name: option }).check({ force: true });

        if (option.toLowerCase() === "other") {
            const otherInput = this.page.getByPlaceholder("Other");
            await otherInput.fill(otherText || "");
        }
    }

    async matrixRadioSelectOption(answers: [string, string][]) {
        for (const [question, option] of answers) {
            const row = this.page.locator(`tr:has-text("${question}")`);
            await row.getByRole("radio", { name: option }).check({ force: true });
        }
    }

    async clickStart() {
        await expect(this.startButton).toBeEnabled({ timeout: 5000 });
        await this.startButton.click();
    }

    async clickNext() {
        await expect(this.nextButton).toBeEnabled({ timeout: 5000 });
        await this.nextButton.click();
    }

    async clickDone() {
        await expect(this.doneButton).toBeEnabled({ timeout: 5000 });
        await this.doneButton.click();
    }

    async fillMultipleAnswers(answers: { question: string; answer: string }[]) {
        for (const { question, answer } of answers) {
            // Use regex for flexible matching and ignore case
            const questionSpan = this.page.locator('span.question-text-span', {
                hasText: new RegExp(question.trim(), 'i')
            });

            // Wait for the question to appear
            await expect(questionSpan).toBeVisible({ timeout: 5000 });

            const questionContainer = questionSpan.locator('..');
            const questionId = await questionContainer.getAttribute('id');

            if (!questionId) {
                throw new Error(`Missing ID for question: "${question}"`);
            }

            const answerField = this.page.locator(
                `input[aria-labelledby="${questionId}"], textarea[aria-labelledby="${questionId}"]`
            );
            await answerField.fill(answer);
        }
    }


    async selectUniqueDropdown(ranks: number[]) {
        const questions = ["Skiing", "Snowboarding", "Biking"];

        if (questions.length !== ranks.length) {
            throw new Error("Questions and ranks array must have the same length");
        }

        for (let i = 0; i < questions.length; i++) {
            const container = this.page.locator('div.controls', { hasText: questions[i] });
            const selectDropdown = container.locator('select.form-select');
            const optionLocator = selectDropdown.locator(`option[value="${ranks[i]}"]`);

            const isDisabled = await optionLocator.evaluate(opt => (opt as HTMLOptionElement).disabled);
            if (isDisabled) {
                throw new Error(`Rank ${ranks[i]} is already taken for "${questions[i]}"`);
            }

            await selectDropdown.selectOption({ value: ranks[i].toString() });
        }
    }

    /**
       * Drag items into their target boxes based on arrays passed from test
       * @param fruits Array of fruit item names
       * @param vegetables Array of vegetable item names
       */
    async dragAllItemsToCorrectBoxes(fruits: string[], vegetables: string[]) {
        await this.fruitsBox.waitFor({ state: 'visible' });
        await this.vegetablesBox.waitFor({ state: 'visible' });
        await this.sourceItems.first().waitFor({ state: 'visible' });

        const count = await this.sourceItems.count();

        for (let i = 0; i < count; i++) {
            const item = this.sourceItems.nth(i);
            const name = (await item.locator('.control-label').textContent())?.trim();
            if (!name) continue;

            // Determine target box
            let targetBox: Locator | null = null;
            if (fruits.includes(name)) {
                targetBox = this.fruitsBox;
            } else if (vegetables.includes(name)) {
                targetBox = this.vegetablesBox;
            } else {
                console.warn(`Item "${name}" not classified, skipping`);
                continue;
            }

            // Get bounding boxes
            const sourceBox = await item.boundingBox();
            const targetBoxBox = await targetBox.boundingBox();

            if (sourceBox && targetBoxBox) {
                // Move mouse to source center
                await this.page.mouse.move(
                    sourceBox.x + sourceBox.width / 2,
                    sourceBox.y + sourceBox.height / 2
                );
                await this.page.mouse.down();

                // Drag to target center
                await this.page.mouse.move(
                    targetBoxBox.x + targetBoxBox.width / 2,
                    targetBoxBox.y + targetBoxBox.height / 2,
                    { steps: 10 }
                );
                await this.page.mouse.up();

                // Optional small wait to let UI update
                await this.page.waitForTimeout(200);
            }
        }
    }

}
