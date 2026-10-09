import { useState, type FormEvent } from "react";
import { KeyRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { setToken, useAccess } from "@/lib/access";

export function AccessPanel() {
  const { hasToken, isLocked } = useAccess();
  const [value, setValue] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (value.trim()) { setToken(value); window.location.reload(); }
    setValue("");
  }

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <Card>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <KeyRoundIcon aria-hidden />
              Unlock this field workspace
            </CardTitle>
            <CardDescription>
              {isLocked && hasToken
                ? "The saved access token was not accepted. Enter the current one."
                : "This deployment protects reports, photos and AI calls with a shared access token from the operator."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="access-token">Access token</FieldLabel>
                <Input
                  id="access-token"
                  type="password"
                  autoComplete="off"
                  spellCheck={false}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
                <FieldDescription>
                  Kept in this tab's session storage only and cleared when the tab closes. It is shared demo access, not a
                  personal account.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
