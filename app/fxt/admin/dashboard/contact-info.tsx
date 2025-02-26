"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Manage your platform`&apos;`s contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" placeholder="support@example.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sales-email">Sales Email</Label>
                  <Input id="sales-email" placeholder="sales@example.com" type="email" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Support Phone</Label>
                  <Input id="phone" placeholder="+1 (555) 000-0000" type="tel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Business Hours</Label>
                  <Input id="hours" placeholder="24/7" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Office Address</Label>
                <Input id="address" placeholder="123 Trading Street" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="NY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="10001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="United States" />
              </div>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Configure your platform`&apos;`s social media presence</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram Group</Label>
                <Input id="telegram" placeholder="https://t.me/yourgroup" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X Profile</Label>
                <Input id="twitter" placeholder="https://twitter.com/yourprofile" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discord">Discord Server</Label>
                <Input id="discord" placeholder="https://discord.gg/yourserver" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Page</Label>
                <Input id="linkedin" placeholder="https://linkedin.com/company/yourcompany" />
              </div>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

