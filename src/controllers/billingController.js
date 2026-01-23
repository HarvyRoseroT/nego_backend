const stripe = require("../config/stripe");

exports.getInvoices = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.stripe_customer_id) {
      return res.status(400).json({ message: "Stripe customer not found" });
    }

    const invoices = await stripe.invoices.list({
      customer: user.stripe_customer_id,
      limit: 20,
    });

    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.id,
      date: new Date(invoice.created * 1000),
      amount: invoice.amount_paid / 100,
      currency: invoice.currency.toUpperCase(),
      status: invoice.status,
      invoice_pdf: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url,
    }));

    return res.json(formattedInvoices);
  } catch (error) {
    console.error("GET INVOICES ERROR:", error);
    return res.status(500).json({ message: "Error fetching invoices" });
  }
};
