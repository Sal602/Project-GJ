from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings

class Migration(migrations.Migration):

    dependencies = [
        ('study_session', '0002_add_user_field'),
    ]

    operations = [
        migrations.AlterField(
            model_name='study_session',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='study_sessions', to=settings.AUTH_USER_MODEL),
        ),
    ]
