<script>
  import { onMount } from "svelte";
  import { Banknote } from "lucide-svelte";
  import aviancalogo from "$lib/assets/Avianca-Ticket-logo.png";
  import { jsPDF } from "jspdf";
  import { PUBLIC_BASE_URL } from '$env/static/public';

  export let data;
  let userid = data.user.userId;

  const userId = window.localStorage.getItem("user_id");
  console.log(userId);

  let purchaseslogs = [];

  onMount(async () => {
    const response = await fetch(
      `${PUBLIC_BASE_URL}/header`
    );
    const data = await response.json();
    billData.company.name = data.Text_Logo;
  });

  onMount(async () => {
    const response = await fetch(
      `${PUBLIC_BASE_URL}/footer`
    );
    const data = await response.json();
    billData.company.address = data.C_1;
  });

  onMount(async () => {
    fetch(`${PUBLIC_BASE_URL}/purchaselogs`)
      .then((response) => response.json())
      .then((userpurchases) => {
        purchaseslogs = userpurchases;
      });
  });

  let billData = {
    company: {
      name: "Your company name",
      address: "Company Address",
      logo: aviancalogo,
    },
    customer: {
      name: "Customer Name",
      address: "Customer Address",
    },
    invoiceNumber: "INV-2024-001",
    date: new Date().toLocaleDateString(),
    ticket: {
      origin: "Country",
      destination: "Country",
      departure: "00-00-0000",
      arrival: "00-00-0000",
      paymenth_method: "",
    },
    items: {
      description: "Avianca ticket",
      quantity: 1,
      unitprice: "0",
      total: "20.00",
    },
    subtotal: "70.00",
    percentage: "0", // Assuming 15% tax
    total: "80.50",
  };

  function generatePDF(
    purchase_number,
    origin,
    destination,
    purchase_date,
    price,
    paymenth_method,
    arrival_date,
    departure_date,
    discount, 
    user_name
  ) {
    const doc = new jsPDF({ unit: "mm", format: [210, 297] }); // A4 format

    // Set document properties (optional)
  doc.setProperties({
    title: `Invoice ${purchase_number}`,
    subject: "Invoice from " + billData.company.name,
  });

  // Company Information
  doc.setFontSize(14);
  if (billData.company.logo) {
    doc.addImage(billData.company.logo, "PNG", 10, 10, 20, 20); // Adjust position and size as needed
  }
  const logoYPosition = 10; // Adjust based on your logo size
  const logoHeight = 20; // Adjust based on your logo size
  const nameYPosition = 10 + logoHeight + 5; // Add margin after logo + desired space
  doc.text(billData.company.name, 10, nameYPosition, { fontStyle: "bold" });
  doc.setFontSize(12);
  doc.text(billData.company.address, 10, nameYPosition + 5); // Maintain horizontal alignment

  // Customer Information
  doc.text("Bill To:", 140, 34, { fontStyle: "bold" }); // Bold "Bill To"
  doc.text(user_name, 140, 39);

  // Invoice Details
  doc.setFontSize(10);
  doc.text("Invoice Number:", 10, 48); // Align left
  doc.text(purchase_number, 50, 48);
  doc.text("Invoice Date:", 10, 54); // Align left
  doc.text(purchase_date, 50, 54);

  //Flight information
  doc.setFontSize(10);
  doc.text("From:", 10, 62); // Align left
  doc.text(origin, 50, 62);
  doc.text("To:", 10, 67); // Align left

  doc.text("Payed with:", 10, 77); // Align left
  doc.text(paymenth_method, 30, 77);

  doc.text(destination, 50, 67);
  doc.text("Departure date:", 120, 62); // Align left
  doc.text(departure_date, 150, 62);
  doc.text("Arrival date:", 120, 67); // Align left
  doc.text(arrival_date, 150, 67);

  // Table Header
  doc.setFontSize(12);
  doc.setFillColor(230, 230, 230); // Light gray background
  doc.rect(10, 85, 180, 8, "F"); // Fill table header
  doc.setTextColor(0, 0, 0); // Black text
  doc.text("Description", 20, 90, { align: "center" }); // Align center
  doc.text("Quantity", 70, 90, { align: "center" });
  doc.text("Unit Price", 120, 90, { align: "center" });
  doc.text("Total", 170, 90, { align: "center" });
  doc.setLineWidth(0.5);
  doc.line(10, 92, 190, 92); // Thicker table line

  // Table Body
  let y = 100;
  // billData.items.forEach((item) => {
    doc.text(billData.items.description, 10, y);
    doc.text(billData.items.quantity.toString(), 70, y);
    doc.text("$ " + price + ".00", 130, y, { align: "right" });
    doc.text("$ " + price + ".00", 175, y, { align: "right" });
    y += 5;
  // });

  // Subtotal, Tax, Total
  doc.setLineWidth(0.5);
  doc.line(10, y + 2, 190, y + 2);
  y += 7;
  doc.text("Subtotal:", 10, y);
  doc.text("$ " + price + ".00", 175, y, { align: "right" });
  y += 7;
  doc.text("Discount:", 10, y);
  if (discount > 0) { 
  doc.text("$ " + (price * (discount/100)) + ".00", 175, y, { align: "right" });
  } else { 
    doc.text("$ " + billData.percentage + ".00", 175, y, { align: "right" });
  }
  y += 7;
  doc.setFontSize(14); // Slightly larger font for total
  doc.text("Total:", 10, y, { fontStyle: "bold" }); // Bold total
  if (discount > 0) { 
  doc.text("$ " + ((price) - (price * (discount/100))) + ".00", 175, y, { align: "right", fontStyle: "bold" });
  } else { 
    doc.text("$ " + ((price) - (price * (discount/100))) + ".00", 175, y, { align: "right", fontStyle: "bold" });
  }

  // Save the PDF
  doc.save("invoice.pdf");
}
</script>

<h1 class="text-xl font-bold mb-8">Purchases logs</h1>

<div>
  {#if purchaseslogs.length > 0}
    {#each purchaseslogs as { purchase_number, ticket, type, origin, destination, purchase_date, price, paymenth_method, arrival_date, departure_date, discount, user_name }}
      <div class="p-10">
        <div
          class="max-w-full bg-white flex flex-col rounded overflow-hidden shadow-lg"
        >
          <div class="flex flex-row items-baseline flex-nowrap bg-gray-100 p-2">
            <h1 class="ml-0 uppercase font-bold text-black-500">Ticket</h1>
            <p class="ml-2 font-normal text-gray-500">{ticket}</p>
            <h1 class="text-grey-700 statef">Purchase date: {purchase_date}</h1>
          </div>
          <div class="mt-2 flex justify-start bg-white p-2">
            <div
              class="flex mx-2 ml-6 h8 px-2 flex-row items-baseline rounded-full bg-gray-100 p-1"
            >
              <div class="reduct"><Banknote /></div>
              <p class="font-normal text-sm ml-1 text-gray-500">{type}</p>
            </div>
          </div>
          <p class="ml-10 uppercase font-bold text-black-500">
            User name: {user_name}
          </p>
          <div class="mt-2 flex sm:flex-row mx-6 sm:justify-between flex-wrap">
            <div class="flex flex-row place-items-center p-2">
              <img
                alt="Qatar Airways"
                class="w-20 h-20"
                src={aviancalogo}
                style="opacity: 1; transform-origin: 0% 50% 0px; transform: none;"
              />
              <div class="flex flex-col ml-2 mx-2">
                <p class="text-xs text-gray-500">Departure date</p>
                <p>{departure_date}</p>
                <p class="text-xs text-gray-500">Arrival date</p>
                <p>{arrival_date}</p>
              </div>
            </div>

            <div class="flex flex-col p-2">
              <p class="text-black-500">
                <span class="font-bold">Origin:</span>
              </p>
              <p class="text-gray-500">{origin}</p>
            </div>
            <div class="flex flex-col flex-wrap p-2">
              <p class="text-black-500">
                <span class="font-bold">Destination</span>
              </p>
              <p class="text-gray-500">{destination}</p>
            </div>
            <div class="flex flex-col flex-wrap p-2">
              <p class="text-black-500">
                <span class="font-bold">Price</span>
              </p>
              {#if discount > 0}
                <p class="text-gray-500">
                  $ {price - price * (discount / 100)}.00
                </p>
              {:else}
                <p class="text-gray-500">$ {price}.00</p>
              {/if}
            </div>
          </div>
          <button
            class="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            on:click={generatePDF(
              purchase_number,
              origin,
              destination,
              purchase_date,
              price,
              paymenth_method,
              arrival_date,
              departure_date,
              discount, 
              user_name
            )}
            data-ripple-light="true"
          >
            Generate PDF
          </button>
        </div>
      </div>
    {/each}
  {:else}
    <div>
      <p class="text-gray-500">No purchases made yet</p>
    </div>
  {/if}
</div>

<style>
  .reduct {
    height: 17px;
    width: 25px;
    color: grey;
  }

  .statef {
    margin-left: 770px;
  }
</style>
