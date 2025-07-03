import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const HOLDED_API_KEY = Deno.env.get('HOLDED_API_KEY')
    
    if (!HOLDED_API_KEY) {
      throw new Error('HOLDED_API_KEY not found in environment variables')
    }

    const { endpoint } = await req.json()
    
    // Base URL for Holded API
    const baseUrl = 'https://api.holded.com/api/invoicing/v1'
    
    // Construct the full URL
    const url = `${baseUrl}/${endpoint}`
    
    // Make request to Holded API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'key': HOLDED_API_KEY
      }
    })

    if (!response.ok) {
      throw new Error(`Holded API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Process the data to identify economic activity investments
    const processedData = processInvestmentData(data)

    return new Response(
      JSON.stringify(processedData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function processInvestmentData(holdedData: any) {
  // This function will process Holded data to identify:
  // 1. Long-term vs short-term positions
  // 2. Economic activity vs non-economic activity
  // 3. Calculate percentages and metrics
  
  const investments = holdedData.map((item: any) => {
    // Logic to determine if investment represents economic activity
    // Based on account codes, categories, or other Holded data structure
    const isEconomicActivity = determineEconomicActivity(item)
    
    return {
      id: item.id || Math.random().toString(36),
      name: item.name || item.desc || 'Unknown Investment',
      amount: parseFloat(item.amount || 0),
      return: calculateReturn(item),
      isEconomicActivity,
      category: item.category || 'Uncategorized',
      accountCode: item.accountCode,
      description: item.desc,
      dateCreated: item.date,
      lastUpdated: new Date().toISOString()
    }
  })

  const totalInvestments = investments.reduce((sum: number, inv: any) => sum + inv.amount, 0)
  const economicActivityInvestments = investments.filter((inv: any) => inv.isEconomicActivity)
  const economicActivityAmount = economicActivityInvestments.reduce((sum: number, inv: any) => sum + inv.amount, 0)
  const economicActivityPercentage = totalInvestments > 0 ? (economicActivityAmount / totalInvestments) * 100 : 0

  return {
    investments,
    metrics: {
      totalInvestments,
      economicActivityPercentage: Math.round(economicActivityPercentage * 100) / 100,
      totalReturn: calculateTotalReturn(investments),
      totalPositions: investments.length
    }
  }
}

function determineEconomicActivity(item: any): boolean {
  // Logic to determine if an investment represents economic activity
  // This should be customized based on your accounting plan in Holded
  
  const accountCode = item.accountCode || ''
  const category = item.category || ''
  const description = (item.desc || '').toLowerCase()
  
  // Example logic - customize based on your Holded account structure
  // Economic activity accounts might include:
  // - Operating assets
  // - Business investments
  // - Active business participations
  
  const economicActivityIndicators = [
    'operating',
    'business',
    'startup',
    'equity',
    'shares',
    'participation',
    'manufacturing',
    'tech',
    'industrial'
  ]
  
  const nonEconomicActivityIndicators = [
    'bond',
    'government',
    'treasury',
    'real estate',
    'property',
    'passive'
  ]
  
  // Check if it's explicitly non-economic activity
  if (nonEconomicActivityIndicators.some(indicator => description.includes(indicator))) {
    return false
  }
  
  // Check if it's explicitly economic activity
  if (economicActivityIndicators.some(indicator => description.includes(indicator))) {
    return true
  }
  
  // Default logic based on account codes (customize for your plan)
  // Account codes starting with certain numbers might indicate economic activity
  if (accountCode.startsWith('2') || accountCode.startsWith('3')) {
    return true // Assuming these are active business assets
  }
  
  return false // Default to non-economic activity if unclear
}

function calculateReturn(item: any): number {
  // Calculate return percentage based on Holded data
  // This will depend on how your accounting data is structured
  const currentValue = parseFloat(item.amount || 0)
  const originalValue = parseFloat(item.originalAmount || item.amount || 0)
  
  if (originalValue === 0) return 0
  
  return ((currentValue - originalValue) / originalValue) * 100
}

function calculateTotalReturn(investments: any[]): number {
  // Calculate weighted average return
  const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0)
  if (totalAmount === 0) return 0
  
  const weightedReturn = investments.reduce((sum, inv) => {
    return sum + (inv.return * inv.amount / totalAmount)
  }, 0)
  
  return Math.round(weightedReturn * 100) / 100
}