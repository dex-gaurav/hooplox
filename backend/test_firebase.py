from firebase_config import get_transactions, add_transaction

# Test adding a transaction
add_transaction(500, "shopping")

# Fetch all transactions
transactions = get_transactions()
print(transactions)
