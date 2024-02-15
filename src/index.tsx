import { ActionPanel, Action, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";

const languages = ["Semua", "Indonesia", "English"] as const;
type Language = (typeof languages)[number];

export default function Command() {
  const [lang, setLang] = useState<Language>("Indonesia");
  const dataId = useFetch("https://salin-abangku.vercel.app/api/all", {
    parseResponse: parseFetchResponse,
  });
  const dataEn = useFetch("https://salin-abangku.vercel.app/api/all?lang=en", {
    parseResponse: parseFetchResponse,
  });

  const onLanguageChange = (value: string) => {
    if (value === "Semua" || value === "Indonesia" || value === "English") {
      setLang(value);
    } else {
      setLang("Semua");
    }
  };

  // loading
  let isLoading = dataId.isLoading || dataEn.isLoading;
  if (lang === "Indonesia") isLoading = dataId.isLoading;
  else if (lang === "English") isLoading = dataEn.isLoading;

  // list
  const listId = dataId.data || [];
  const listEn = dataEn.data || [];

  let list = [...new Set([...listId, ...listEn])];
  if (lang === "Indonesia") list = listId;
  else if (lang === "English") list = listEn;

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Salin Abangkuuuhh 🫡🔥🔝"
      searchBarAccessory={<LanguageDropdown value={lang} onChange={onLanguageChange} />}
    >
      {list.map((item) => (
        <SearchListItem key={item} searchResult={item} />
      ))}
    </List>
  );
}

function SearchListItem({ searchResult }: { searchResult: string }) {
  return (
    <List.Item
      title={searchResult}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.CopyToClipboard title="Salin Abangkuuhh 🫡🔥🔝" content={searchResult} />
            <Action.OpenInBrowser title="Kasih Paham Capt 🔥💯🙌🏼" url="https://salin-abangku.vercel.app/" />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}

function LanguageDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <List.Dropdown placeholder="Kasih Paham Capt 🔥💯🙌🏼" tooltip="Pilih Bahasa" value={value} onChange={onChange}>
      {languages.map((lang) => (
        <List.Dropdown.Item key={lang} title={lang} value={lang} />
      ))}
    </List.Dropdown>
  );
}

async function parseFetchResponse(response: Response) {
  const results: string[] = await response.json();

  if (!response.ok) {
    throw new Error("Apotik tutup captain 🔥🔥💯🔝");
  }

  return results;
}
