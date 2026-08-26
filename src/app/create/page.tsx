"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { proposeMarket } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/format";
import type { MarketCategory, OutcomeKind } from "@/lib/types";

export default function CreatePage() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MarketCategory>("crypto");
  const [resolutionDate, setResolutionDate] = useState("");
  const [kind, setKind] = useState<OutcomeKind>("binary");
  const [outcomes, setOutcomes] = useState(["Yes", "No"]);
  const [bondAmount, setBondAmount] = useState("250");

  const mutation = useMutation({
    mutationFn: proposeMarket,
    onSuccess: () => router.push("/presale"),
  });

  const setKindAndOutcomes = (next: OutcomeKind) => {
    setKind(next);
    setOutcomes(next === "binary" ? ["Yes", "No"] : ["Option A", "Option B", "Option C"]);
  };

  const updateOutcome = (index: number, value: string) => {
    setOutcomes((prev) => prev.map((o, i) => (i === index ? value : o)));
  };

  const addOutcome = () => setOutcomes((prev) => [...prev, `Option ${prev.length + 1}`]);
  const removeOutcome = (index: number) => setOutcomes((prev) => prev.filter((_, i) => i !== index));

  const canSubmit =
    title.trim().length > 5 &&
    resolutionDate &&
    outcomes.every((o) => o.trim().length > 0) &&
    parseFloat(bondAmount) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    mutation.mutate({
      title,
      description,
      category,
      resolutionDate: new Date(resolutionDate).toISOString(),
      kind,
      outcomeLabels: outcomes,
      bondAmount: parseFloat(bondAmount),
      creatorHandle: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "anon.base",
    });
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6 flex flex-col gap-2">
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-xs font-medium text-violet">
          <Sparkles className="size-3.5" />
          Creator Flow
        </div>
        <h1 className="text-2xl font-bold">Propose a Market</h1>
        <p className="text-sm text-muted-foreground">
          Stake a bond to propose a market. Once it goes live, you earn a recurring cut of trading fees on every
          trade it settles.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Question</Label>
            <Input
              id="title"
              placeholder="Will XYZ happen by [date]?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Add context that helps traders understand this market"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as MarketCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="resolutionDate">Resolution date</Label>
              <Input
                id="resolutionDate"
                type="date"
                value={resolutionDate}
                onChange={(e) => setResolutionDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Outcome type</Label>
            <ToggleGroup type="single" value={kind} onValueChange={(v) => v && setKindAndOutcomes(v as OutcomeKind)}>
              <ToggleGroupItem value="binary">Binary (Yes/No)</ToggleGroupItem>
              <ToggleGroupItem value="multi">Multi-outcome</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {kind === "multi" && (
            <div className="flex flex-col gap-2">
              <Label>Outcomes</Label>
              {outcomes.map((outcome, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={outcome} onChange={(e) => updateOutcome(i, e.target.value)} />
                  {outcomes.length > 2 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeOutcome(i)}>
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="w-fit gap-1.5" onClick={addOutcome}>
                <Plus className="size-3.5" />
                Add outcome
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bond">Bond stake (USDC)</Label>
            <Input
              id="bond"
              inputMode="decimal"
              value={bondAmount}
              onChange={(e) => setBondAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Bonded markets enter Pre-Sale until they reach enough backing to go live.
            </p>
          </div>

          <Button type="submit" size="lg" disabled={!canSubmit || mutation.isPending}>
            {mutation.isPending ? "Proposing..." : isConnected ? "Propose Market" : "Connect Wallet to Propose"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
