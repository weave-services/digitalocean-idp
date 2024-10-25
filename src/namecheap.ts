import axios, { AxiosInstance } from "axios";
import xml2js from "xml2js";

interface DnsRecord {
  name: string;
  type: string;
  address: string;
  ttl?: string;
}

class NamecheapDnsClient {
  private api: AxiosInstance;
  private domain: string;
  private records: DnsRecord[] = [];

  constructor(
    apiUser: string,
    apiKey: string,
    clientIp: string,
    domain: string,
    sandbox: boolean = false
  ) {
    this.domain = domain;

    this.api = axios.create({
      baseURL: sandbox
        ? "https://api.sandbox.namecheap.com/xml.response"
        : "https://api.namecheap.com/xml.response",
      params: {
        ApiUser: apiUser,
        ApiKey: apiKey,
        UserName: apiUser,
        ClientIp: clientIp,
      },
    });
  }

  async init(): Promise<void> {
    const [sld, tld] = this.domain.split(".");
    const response = await this.api.get("", {
      params: {
        Command: "namecheap.domains.dns.getHosts",
        SLD: sld,
        TLD: tld,
      },
    });
    this.records = await this.parseDnsRecords(response.data);
  }

  private async parseDnsRecords(data: any): Promise<DnsRecord[]> {
    const result = await xml2js.parseStringPromise(data);
    const hosts =
      result.ApiResponse.CommandResponse[0].DomainDNSGetHostsResult[0].host;
    return hosts.map((host: any) => ({
      name: host.$.Name,
      type: host.$.Type,
      address: host.$.Address,
      ttl: host.$.TTL,
    }));
  }

  list(): DnsRecord[] {
    return this.records;
  }

  add(record: DnsRecord): void {
    this.records.push(record);
  }

  delete(name: string, type: string): void {
    this.records = this.records.filter(
      (record) => !(record.name === name && record.type === type)
    );
  }

  deleteAll(name: string, type: string): void {
    this.records = this.records.filter(
      (record) => record.name !== name || record.type !== type
    );
  }

  getAll(name: string, type: string): DnsRecord[] {
    return this.records.filter(
      (record) => record.name === name && record.type === type
    );
  }

  setAll(name: string, type: string, addresses: string[]): void {
    this.records = this.records.filter(
      (record) => record.name !== name || record.type !== type
    );

    addresses.forEach((address) => {
      this.records.push({ name, type, address });
    });
  }

  async commit(): Promise<void> {
    const [sld, tld] = this.domain.split(".");
    const params: any = {
      Command: "namecheap.domains.dns.setHosts",
      SLD: sld,
      TLD: tld,
    };

    this.records.forEach((record, index) => {
      params[`HostName${index + 1}`] = record.name;
      params[`RecordType${index + 1}`] = record.type;
      params[`Address${index + 1}`] = record.address;
      params[`TTL${index + 1}`] = record.ttl || "1800";
    });

    const response = await this.api.get("", { params });
    const result = await xml2js.parseStringPromise(response.data);
    if (result.ApiResponse.$.Status !== "OK") {
      throw new Error("Failed to commit DNS records");
    }
  }
}

export default NamecheapDnsClient;
