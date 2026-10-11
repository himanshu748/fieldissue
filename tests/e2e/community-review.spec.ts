import { expect, test } from "@playwright/test";

test.skip(process.env.FIELDISSUE_LOCAL_E2E !== "1", "Isolated browser fixtures only");
for (const allExcluded of [false, true]) {
  test(`community review selects eligible evidence: all excluded ${allExcluded}`, async ({ page, baseURL }) => {
    if (baseURL !== "http://127.0.0.1:3190") throw new Error("Local fixture only");
    const actions: { observationId: string }[] = [];
    const workspace = {id:"workspace", name:"Synthetic review group", area:"Local fixture", owner:false};
    await page.route("**/v1/**", async route => {
      const path = new URL(route.request().url()).pathname;
      let data: unknown;
      if (path === "/v1/account/me") data = {account:{id:"member",username:"fixture"}};
      else if (path === "/v1/account/notifications") data = {items:[]};
      else if (path === "/v1/community/list") data = {items:[workspace]};
      else if (path === "/v1/community/workspace") data = {...workspace, members:[], proposals:[], issues:[{id:"issue",public_id:"FI-FIXTURE",title:"Synthetic tree",status:"OPEN"}]};
      else if (path === "/v1/issues/issue") data = {observations:[{id:"A",exclusionType:allExcluded?"WRONG_PHOTOGRAPH":null},{id:"B",exclusionType:allExcluded?"WRONG_PHOTOGRAPH":null},{id:"C",exclusionType:"WRONG_PHOTOGRAPH"}]};
      else if (path === "/v1/community/workspace/propose") { actions.push(route.request().postDataJSON()); data = {id:"proposal"}; }
      else throw new Error(`Unexpected fixture request ${path}`);
      await route.fulfill({json:data});
    });
    await page.goto("/app/community");
    await page.getByRole("button", {name:"Synthetic review group"}).click();
    await page.getByLabel("Resolution evidence note").fill("Current A to B comparison supports review.");
    await page.getByRole("button", {name:"Request evidence review"}).click();
    if (allExcluded) {
      await expect(page.getByText("No eligible revisit evidence remains. Restore a valid observation or add a new revisit.")).toBeVisible();
      expect(actions).toHaveLength(0);
    } else {
      await expect(page.getByText("Review requested. Two other member accounts must approve the latest evidence.")).toBeVisible();
      expect(actions).toEqual([{issueId:"issue",observationId:"B",note:"Current A to B comparison supports review."}]);
    }
  });
}
