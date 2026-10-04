def calculate_fno_reality(capital: float, source: str, instrument: str, 
                          expiry_days: int, loan_apr: float = 0) -> dict:
    sebi_stat = "SEBI Study: 93% of individual traders in equity F&O incurred net losses. Average loss: ₹1.1 lakh per trader per year."
    loss_probability = 93.0
    
    expected_loss = min(capital, 110000.0)
    
    if expiry_days <= 1:
        break_even_move = "Requires extremely high underlying movement in 1 day to overcome theta decay and premiums."
    else:
        break_even_move = f"Requires significant directional move within {expiry_days} days to offset premium paid."
        
    debt_spiral = None
    if source in ['loan', 'borrowed']:
        if loan_apr > 0:
            yearly_interest = capital * (loan_apr / 100)
            debt_spiral = f"Borrowing to trade F&O is extremely risky. A total loss plus {loan_apr}% interest means you will owe ₹{capital + yearly_interest:,.2f} in 1 year."
        else:
            debt_spiral = "Trading F&O with borrowed money often leads to a debt trap since 93% traders lose money."
            
    reality_message = f"Statistically, you have a 93% chance of losing this money. Using {source} funds for {instrument} is highly speculative."
    
    return {
        "loss_probability": loss_probability,
        "expected_loss": expected_loss,
        "break_even_move": break_even_move,
        "debt_spiral": debt_spiral,
        "reality_message": reality_message,
        "sebi_stat": sebi_stat
    }
